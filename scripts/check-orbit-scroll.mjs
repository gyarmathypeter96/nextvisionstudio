import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';

// Run the actual scroll controller with measurable layout reads and DOM writes.
// Modal/video handling remains covered by browser verification.
const source = (await readFile('public/orbit/app.js', 'utf8')).split('\nfunction updateMotion()')[0] + '\nrenderScroll();\n})();';
function fixture({ reduced = false, native = false } = {}) {
  const log = [], frames = [], handlers = {};
  const preference = { matches: reduced };
  let context;
  const element = (name, top = 0, height = 0) => {
    const values = new Map();
    return {
      style: new Proxy({
        setProperty(key, value) { log.push(['write', name, key]); values.set(key, value); },
        getPropertyValue: key => values.get(key),
        removeProperty(key) { log.push(['write', name, key]); values.delete(key); },
      }, { get: (target, key) => key in target ? target[key] : values.get(key),
           set(target, key, value) { log.push(['write', name, key]); values.set(key, value); return true; } }),
      dataset: {}, classList: { toggle() {}, remove() {} }, setAttribute() {}, removeAttribute() {},
      getBoundingClientRect() { log.push(['read', name]); return { top: top - context.scrollY }; },
      get offsetHeight() { log.push(['read', name]); return height; },
      get clientHeight() { log.push(['read', name]); return height; },
    };
  };
  const hero = element('hero', 0, 1561), stage = element('stage', 0, 844), workflow = element('workflow', 5000, 3100), workflowStage = element('workflow-stage', 5000, 844);
  const plane = element('plane'), astronaut = element('astronaut'), copy = element('copy'), cta = element('cta');
  hero.querySelector = selector => ({ '.hero-stage': stage, '.astronaut-plane': plane, '.astronaut-subject': astronaut, '.hero-copy': copy })[selector] || null;
  workflow.querySelector = () => workflowStage;
  const slides = Array.from({ length: 6 }, (_, i) => element(`slide-${i}`));
  const nodes = { '.hero-scroll': hero, '.hero-stage': stage, '#workflow': workflow, '.workflow-stage': workflowStage,
    '#film-library': { textContent: '{}', dataset: {} }, '.hero-cta': cta };
  const lists = { '.workflow-slide': slides, '.workflow-rail li': [], '.workflow-icon': [], '.marquee-track': [] };
  context = { document: { querySelector: s => nodes[s] || null, querySelectorAll: s => lists[s] || [], fonts: { ready: { then() {} } } },
    CSS: { supports: () => native }, innerWidth: 390, innerHeight: 844, scrollY: 0,
    matchMedia: () => preference, addEventListener: (name, cb) => { handlers[name] = cb; },
    requestAnimationFrame: cb => frames.push(cb), ResizeObserver: class { observe() {} },
  };
  vm.runInNewContext(source, context);
  log.length = 0;
  return { log, hero, workflow, plane, astronaut, copy, cta, reduce(value) { preference.matches = value; handlers.resize(); this.flush(); }, scroll(y) { context.scrollY = y; handlers.scroll(); this.flush(); },
    flush() { while (frames.length) frames.shift()(); },
    resize(height, width = context.innerWidth) { context.innerWidth = width; context.innerHeight = height; handlers.resize(); this.flush(); } };
}

test('scroll frames do not request layout after writing animation styles', () => {
  const f = fixture(); f.scroll(250);
  const firstWrite = f.log.findIndex(row => row[0] === 'write');
  assert.ok(firstWrite >= 0);
  assert.equal(f.log.slice(firstWrite).filter(row => row[0] === 'read').length, 0);
});
test('scrolling in the hero does not rewrite the offscreen workflow', () => {
  const f = fixture(); f.scroll(250);
  assert.equal(f.log.filter(row => row[0] === 'write' && row[1] === 'workflow').length, 0);
});
test('mobile toolbar height changes do not jump the astronaut at the same scroll position', () => {
  const f = fixture(); f.scroll(250);
  const scale = f.astronaut.style.transform;
  f.resize(744);
  assert.equal(f.astronaut.style.transform, scale);
});
test('scroll events after the hero do not keep rewriting its completed frame', () => {
  const f = fixture(); f.scroll(2000); f.log.length = 0; f.scroll(2200);
  assert.equal(f.log.filter(row => row[0] === 'write' && ['hero','plane','astronaut','copy','cta'].includes(row[1])).length, 0);
});
test('returning to the hero reverses the animation and reduced motion stays static', () => {
  const f = fixture(); f.scroll(350); assert.match(f.astronaut.style.transform, /scale\(1\.[1-9]/);
  f.scroll(0); assert.match(f.astronaut.style.transform, /scale\(1\.0000\)/);
  const still = fixture({ reduced: true }); still.scroll(350);
  assert.match(still.astronaut.style.transform, /scale\(1\.0000\)/);
});

test('a width change updates the starting astronaut position even without scrolling', () => {
  const f = fixture(); f.resize(844, 1280);
  assert.equal(f.plane.style.transform, 'translate3d(320px,0,0)');
  f.resize(844, 390); assert.equal(f.plane.style.transform, 'translate3d(0px,0,0)');
});

test('supported mobile browsers use native scroll animation without per-frame hero style writes', () => {
  const f = fixture({ native: true });
  assert.equal(f.hero.dataset.heroMotion, 'native');
  f.scroll(250);
  assert.equal(f.log.filter(row => row[0] === 'write').length, 0);
});

test('native mobile motion returns to a readable static state for reduced motion', () => {
  const f = fixture({ native: true }); f.scroll(710); f.reduce(true);
  assert.equal(f.hero.dataset.heroMotion, 'script');
  assert.equal(f.copy.style.opacity, '1.000');
  assert.equal(f.cta.inert, false);
  f.reduce(false); assert.equal(f.hero.dataset.heroMotion, 'native');
});

test('native mobile motion can switch to desktop fallback and back without stale transforms', () => {
  const f = fixture({ native: true }); f.resize(900, 1280);
  assert.equal(f.hero.dataset.heroMotion, 'script');
  assert.equal(f.plane.style.transform, 'translate3d(320px,0,0)');
  f.resize(844, 390);
  assert.equal(f.hero.dataset.heroMotion, 'native');
  assert.ok(!f.astronaut.style.transform);
  assert.ok(!f.cta.style.transform);
});

test('mobile copy and CTA fade before the astronaut crosses the text, in both motion modes', () => {
  const script = fixture(); script.scroll(150);
  assert.equal(script.copy.style.opacity, '0.000'); assert.equal(script.cta.inert, true);
  script.scroll(0); assert.equal(script.copy.style.opacity, '1.000'); assert.equal(script.cta.inert, false);
  const native = fixture({ native: true }); native.scroll(150); assert.equal(native.cta.inert, true);
  native.scroll(0); assert.equal(native.cta.inert, false);
});
