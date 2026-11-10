(() => {
const hero = document.querySelector('.hero-scroll');
const orbit = document.querySelector('#orbit');
const heroCta = document.querySelector('.hero-cta');
const motionToggle = document.querySelector('#motion-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const workflow = document.querySelector('#workflow');
const slides = [...document.querySelectorAll('.workflow-slide')];
const steps = [...document.querySelectorAll('.workflow-rail li')];
const workflowIcons = [...document.querySelectorAll('.workflow-icon')];
const dialog = document.querySelector('#video-dialog');
const player = document.querySelector('#project-player');
const dialogTitle = document.querySelector('#dialog-title');
const colors = ['#9239ff', '#ccff59', '#ff9e36', '#ef72d4', '#82c9ff', '#ccff59'];
const films = JSON.parse(document.querySelector('#film-library').textContent);
const assetBase = document.querySelector('#film-library').dataset.assetsBase || 'assets/';
const clamp = (value, low = 0, high = 1) => Math.min(high, Math.max(low, value));
let motionPaused = reducedMotion.matches;
let queued = false;
let opener;
const heroStage = hero.querySelector('.hero-stage');
const workflowStage = workflow.querySelector('.workflow-stage');
let geometryDirty = true;
let geometry;
let previousHero = NaN;
let previousJourney = NaN;
let previousStep = -1;
let wasReduced = false;

function refreshGeometry() {
  // Read layout together, before any animation writes. The stable sticky-stage
  // height avoids a jump when Safari's address bar changes window.innerHeight.
  const y = scrollY;
  if (geometry && geometry.width !== innerWidth) {
    previousHero = NaN;
    wasReduced = false;
  }
  geometry = {
    heroTop: hero.getBoundingClientRect().top + y,
    heroRange: Math.max(1, hero.offsetHeight - heroStage.clientHeight),
    workflowTop: workflow.getBoundingClientRect().top + y,
    workflowRange: Math.max(1, workflow.offsetHeight - workflowStage.clientHeight),
    width: innerWidth,
  };
  geometryDirty = false;
}
function invalidateGeometry() { geometryDirty = true; requestRender(); }

// The copy is visual only; keyboard and accessibility navigation use the original group.
document.querySelectorAll('.marquee-track').forEach(track => {
  const copy = track.querySelector('.marquee-group').cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.setAttribute('data-measure-clone', 'true');
  copy.querySelectorAll('button,a').forEach(el => el.setAttribute('tabindex', '-1'));
  copy.querySelectorAll('img').forEach(el => el.alt = '');
  track.append(copy);
});

function renderScroll() {
  queued = false;
  if (geometryDirty) refreshGeometry();
  if (reducedMotion.matches) {
    if (wasReduced) return;
    wasReduced = true;
    slides.forEach(slide => slide.setAttribute('aria-hidden', 'false'));
    hero.style.setProperty('--copy-y', '0px');
    hero.style.setProperty('--copy-opacity', '1');
    if (heroCta) heroCta.inert = false;
    hero.style.setProperty('--astro-x', `${innerWidth <= 760 ? 0 : innerWidth * .25}px`);
    hero.style.setProperty('--astro-scale', '1');
    hero.style.setProperty('--astro-y', '0px');
    hero.style.setProperty('--astro-rotate', '0deg');
    hero.classList.remove('astronaut-in-front');
    return;
  }
  if (wasReduced) {
    previousHero = previousJourney = NaN;
    previousStep = -1;
    wasReduced = false;
  }
  const heroProgress = clamp((scrollY - geometry.heroTop) / geometry.heroRange);
  const journey = clamp((scrollY - geometry.workflowTop) / geometry.workflowRange);
  const smallScreen = geometry.width <= 760;
  if (heroProgress !== previousHero) {
    previousHero = heroProgress;
    hero.style.setProperty('--astro-x', `${smallScreen ? 0 : geometry.width * .25 * (1 - clamp(heroProgress / .4))}px`);
    hero.style.setProperty('--astro-scale', (1 + heroProgress * .68).toFixed(4));
    hero.style.setProperty('--astro-y', `${-heroProgress * (smallScreen ? 197 : 140)}px`);
    hero.style.setProperty('--astro-rotate', `${heroProgress * -4}deg`);
    hero.style.setProperty('--copy-y', `${-heroProgress * (smallScreen ? 20 : 85)}px`);
    const copyOpacity = clamp(1 - Math.max(0, heroProgress - .65) / .35);
    hero.style.setProperty('--copy-opacity', copyOpacity.toFixed(3));
    if (heroCta) heroCta.inert = copyOpacity < .05;
    hero.classList.toggle('astronaut-in-front', heroProgress > .18);
    hero.style.setProperty('--caption-opacity', clamp((heroProgress - .42) * 3).toFixed(3));
    hero.style.setProperty('--caption-y', `${(1 - heroProgress) * 30}px`);
  }
  if (journey === previousJourney) return;
  previousJourney = journey;
  const phase = journey * (slides.length - 1);
  const current = Math.round(phase);
  workflow.style.setProperty('--journey', journey.toFixed(5));
  workflow.style.setProperty('--phase', phase.toFixed(4));
  const stepChanged = current !== previousStep;
  if (stepChanged) {
    workflow.style.setProperty('--step-color', colors[current]);
    workflowIcons.forEach((icon, i) => icon.classList.toggle('is-current', i === current));
  }
  slides.forEach((slide, i) => {
    const distance = i - phase;
    slide.style.opacity = clamp(1 - Math.abs(distance) * 1.65).toFixed(4);
    slide.style.transform = `translateY(${distance * 85}px)`;
    if (stepChanged) slide.setAttribute('aria-hidden', String(i !== current));
  });
  if (stepChanged) steps.forEach((step, i) => {
    step.classList.toggle('is-active', i === current);
    step.classList.toggle('is-past', i < current);
    if (i === current) step.setAttribute('aria-current', 'step');
    else step.removeAttribute('aria-current');
  });
  previousStep = current;
}
function requestRender() { if (!queued) { queued = true; requestAnimationFrame(renderScroll); } }
addEventListener('scroll', requestRender, { passive: true });
addEventListener('resize', invalidateGeometry, { passive: true });
addEventListener('load', invalidateGeometry, { once: true });
document.fonts.ready.then(invalidateGeometry);
// Packages, accordions and loaded media can shift a later sticky section.
const layoutObserver = new ResizeObserver(invalidateGeometry);
[document.body, hero, heroStage, workflow, workflowStage].forEach(element => layoutObserver.observe(element));

function updateMotion() {
  document.body.classList.toggle('ambient-paused', motionPaused || document.hidden || dialog.open);
  motionToggle?.setAttribute('aria-pressed', String(motionPaused));
  motionToggle?.setAttribute('aria-label', motionPaused ? 'Play animation' : 'Pause animation');
  if (motionToggle) motionToggle.innerHTML = `<span aria-hidden="true">${motionPaused ? '▷' : 'Ⅱ'}</span>`;
  if (motionPaused || document.hidden || dialog.open) orbit?.pause();
  else if (orbit) orbit.play().catch(() => {
    motionPaused = true;
    document.body.classList.add('ambient-paused');
    motionToggle?.setAttribute('aria-pressed', 'true');
    motionToggle?.setAttribute('aria-label', 'Play animation');
    if (motionToggle) motionToggle.innerHTML = '<span aria-hidden="true">▷</span>';
  });
}
motionToggle?.addEventListener('click', () => { motionPaused = !motionPaused; updateMotion(); });
document.addEventListener('visibilitychange', updateMotion);
reducedMotion.addEventListener('change', () => { motionPaused = reducedMotion.matches; updateMotion(); requestRender(); });

const videoChoices = dialog.querySelector('.video-choices');
function selectClip(film, index) {
  const clip = film.clips[index] || film.clips[0];
  player.pause();
  player.dispatchEvent(new Event('nvs:video-reset', { bubbles: true }));
  player.setAttribute('aria-label', `${film.title}: ${clip.title}`);
  player.title = `${film.title}: ${clip.title}`;
  dialogTitle.textContent = `${film.title}: ${clip.title}`;
  dialog.querySelector('.film-category').textContent = film.category || '';
  dialog.querySelector('.film-description').textContent = film.summary || '';
  const caseLink = dialog.querySelector('.film-case-link');
  caseLink.href = film.caseStudy;
  caseLink.textContent = `Explore the ${film.title} project`;
  player.poster = clip.poster.startsWith('/') ? clip.poster : `${assetBase}${clip.poster}`;
  player.src = clip.file.startsWith('/') ? clip.file : `${assetBase}${clip.file}`;
  player.load();
  videoChoices.querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  player.play().catch(() => {});
}
document.querySelectorAll('[data-video]').forEach(button => button.addEventListener('click', () => {
  const film = films[button.dataset.video];
  if (!film) return;
  opener = button;
  videoChoices.replaceChildren();
  film.clips.forEach((clip, index) => {
    const choice = document.createElement('button');
    choice.type = 'button'; choice.textContent = clip.title;
    choice.addEventListener('click', () => selectClip(film, index));
    videoChoices.append(choice);
  });
  videoChoices.hidden = film.clips.length < 2;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  document.body.classList.add('ambient-paused');
  orbit?.pause();
  selectClip(film, Number(button.dataset.clip) || 0);
}));
document.querySelector('#close-video').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const b = dialog.getBoundingClientRect();
  if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  player.pause(); player.removeAttribute('src'); player.load();
  document.body.style.removeProperty('overflow');
  opener?.focus({ preventScroll: true });
  updateMotion();
});
document.querySelectorAll('.service-list details').forEach(item => item.addEventListener('toggle', () => {
  if (item.open) document.querySelectorAll('.service-list details').forEach(other => { if (other !== item) other.open = false; });
}));
updateMotion();
renderScroll();
// The same six labels also allow a direct jump, with no extra controls or copy.
document.querySelectorAll('[data-goto-step]').forEach(button => button.addEventListener('click', () => {
  const start = workflow.getBoundingClientRect().top + scrollY;
  const distance = Math.max(0, workflow.offsetHeight - innerHeight);
  window.scrollTo({ top: start + distance * Number(button.dataset.gotoStep) / (slides.length - 1), behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}));

// Package selection and expiry use the original MonthlyContentPackages component.
const mobilePricing = matchMedia('(max-width:760px)');
function syncPricingDetails() { document.querySelectorAll('.plan-details').forEach(detail => detail.open = !mobilePricing.matches); }
mobilePricing.addEventListener('change', syncPricingDetails);
syncPricingDetails();
document.documentElement.dataset.orbitReady = 'true';
})();
