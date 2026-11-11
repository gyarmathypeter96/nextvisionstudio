import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
const app = await readFile('public/orbit/app.js', 'utf8');
const script = app.slice(app.indexOf('// Counts start on visibility'), app.indexOf("document.documentElement.dataset.orbitReady"));
function fixture({ reduced = false } = {}) {
  const counters = [
    ['€10', 100, 10, '€', ''], ['1M+', 0, 1000000, '', '+'],
    ['€10K+', 0, 10000, '€', '+'], ['1K+', 0, 1000, '', '+'],
  ].map(([textContent, start, target, prefix, suffix]) => ({ textContent, dataset: { start, target, prefix, suffix } }));
  let callback, frameId = 0, change, visibility;
  const frames = new Map();
  const motion = { matches: reduced, addEventListener: (_, fn) => { change = fn; } };
  const document = { hidden: false, querySelectorAll: () => counters, addEventListener: (_, fn) => { visibility = fn; } };
  vm.runInNewContext(script, { document, reducedMotion: motion,
    requestAnimationFrame: fn => { frames.set(++frameId, fn); return frameId; },
    cancelAnimationFrame: id => frames.delete(id),
    IntersectionObserver: class { constructor(fn) { callback = fn; } observe() {} unobserve() {} disconnect() {} },
  });
  return { counters, frames,
    show(index) { callback([{ target: counters[index], isIntersecting: true }]); },
    tick(time) { const current = [...frames.values()]; frames.clear(); current.forEach(fn => fn(time)); },
    reduce() { motion.matches = true; change(); },
    hide() { document.hidden = true; visibility(); },
  };
}
test('a counter only starts when visible and changes through intermediate values', () => {
  const f = fixture(); assert.equal(f.frames.size, 0);
  f.show(1); f.tick(0); assert.equal(f.counters[1].textContent, '0+');
  f.tick(650); assert.equal(f.counters[1].textContent, '875K+');
  assert.equal(f.counters[0].textContent, '€10');
});
test('all four counters finish with their original compact approved totals', () => {
  const f = fixture(); f.counters.forEach((_, i) => f.show(i));
  f.tick(0); f.tick(1300);
  assert.deepEqual(f.counters.map(c => c.textContent), ['€10','1M+','€10K+','1K+']);
  assert.equal(f.frames.size, 0);
  f.counters.forEach((_, i) => f.show(i)); assert.equal(f.frames.size, 0);
});
test('reduced motion keeps static totals without animation frames', () => {
  const f = fixture({ reduced: true });
  assert.equal(f.frames.size, 0);
  assert.deepEqual(f.counters.map(c => c.textContent), ['€10','1M+','€10K+','1K+']);
});
test('a preference change or hidden tab settles active counts instead of leaving partial values', () => {
  const f = fixture(); f.show(2); f.tick(0); f.tick(200); f.reduce();
  assert.equal(f.counters[2].textContent, '€10K+'); assert.equal(f.frames.size, 0);
  const g = fixture(); g.show(1); g.tick(0); g.hide();
  assert.equal(g.counters[1].textContent, '1M+'); assert.equal(g.frames.size, 0);
});
