import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';

// Run the actual scroll controller with measurable layout reads and DOM writes.
// Modal/video handling remains covered by browser verification.
const source = (await readFile('public/orbit/app.js', 'utf8')).split('\nfunction updateMotion()')[0] + '\nrenderScroll();\n})();';
function fixture({ reduced = false } = {}) {
  const log = [], frames = [], handlers = {};
  const preference = { matches: reduced };
  let context;
  const element = (name, top = 0, height = 0) => {
    const values = new Map();
    return {
      style: { setProperty(key, value) { log.push(['write', name, key]); values.set(key, value); }, getPropertyValue: key => values.get(key) },
      classList: { toggle() {}, remove() {} }, setAttribute() {}, removeAttribute() {},
      getBoundingClientRect() { log.push(['read', name]); return { top: top - context.scrollY }; },
      get offsetHeight() { log.push(['read', name]); return height; },
      get clientHeight() { log.push(['read', name]); return height; },
    };
  };
  const hero = element('hero', 0, 1561), stage = element('stage', 0, 844), workflow = element('workflow', 5000, 3100), workflowStage = element('workflow-stage', 5000, 844);
  hero.querySelector = () => stage;
  workflow.querySelector = () => workflowStage;
  const slides = Array.from({ length: 6 }, (_, i) => element(`slide-${i}`));
  const nodes = { '.hero-scroll': hero, '.hero-stage': stage, '#workflow': workflow, '.workflow-stage': workflowStage,
    '#film-library': { textContent: '{}', dataset: {} }, '.hero-cta': {} };
  const lists = { '.workflow-slide': slides, '.workflow-rail li': [], '.workflow-icon': [], '.marquee-track': [] };
  context = { document: { querySelector: s => nodes[s] || null, querySelectorAll: s => lists[s] || [], fonts: { ready: { then() {} } } },
    innerWidth: 390, innerHeight: 844, scrollY: 0,
    matchMedia: () => preference, addEventListener: (name, cb) => { handlers[name] = cb; },
    requestAnimationFrame: cb => frames.push(cb), ResizeObserver: class { observe() {} },
  };
  vm.runInNewContext(source, context);
  log.length = 0;
  return { log, hero, workflow, scroll(y) { context.scrollY = y; handlers.scroll(); this.flush(); },
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
  const scale = f.hero.style.getPropertyValue('--astro-scale');
  f.resize(744);
  assert.equal(f.hero.style.getPropertyValue('--astro-scale'), scale);
});
test('scroll events after the hero do not keep rewriting its completed frame', () => {
  const f = fixture(); f.scroll(2000); f.log.length = 0; f.scroll(2200);
  assert.equal(f.log.filter(row => row[0] === 'write' && row[1] === 'hero').length, 0);
});
test('returning to the hero reverses the animation and reduced motion stays static', () => {
  const f = fixture(); f.scroll(350); assert.notEqual(f.hero.style.getPropertyValue('--astro-scale'), '1.0000');
  f.scroll(0); assert.equal(Number(f.hero.style.getPropertyValue('--astro-scale')), 1);
  const still = fixture({ reduced: true }); still.scroll(350);
  assert.equal(Number(still.hero.style.getPropertyValue('--astro-scale')), 1);
});

test('a width change updates the starting astronaut position even without scrolling', () => {
  const f = fixture(); f.resize(844, 1280);
  assert.equal(f.hero.style.getPropertyValue('--astro-x'), '320px');
  f.resize(844, 390); assert.equal(f.hero.style.getPropertyValue('--astro-x'), '0px');
});
