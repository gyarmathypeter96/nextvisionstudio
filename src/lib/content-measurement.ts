import { ANALYTICS_HOSTS, GA4_MEASUREMENT_ID } from '../config/site';
import { safeMeasurementPath } from './behavior-tracking';
import { measurementVisible } from './measurement-visibility';

// Detail events go only to GA4, never to the advertising conversion tags.
type MeasurementWindow = Window & { nvsContentBound?: boolean; nvsTrackingExcluded?: boolean; gtag?: (...args: unknown[]) => void; clarity?: (...args: unknown[]) => void };
export function initialiseContentMeasurement(w: MeasurementWindow, doc: Document) {
  if (w.nvsContentBound || !ANALYTICS_HOSTS.includes(w.location.hostname) || w.nvsTrackingExcluded) return;
  w.nvsContentBound = true;
  const allowed = () => { try { return !w.nvsTrackingExcluded && w.localStorage.getItem('nvs-cookie-consent') === 'granted'; } catch { return false; } };
  const visible = () => doc.visibilityState === 'visible' && doc.hasFocus();
  const now = () => w.performance.now();
  const path = w.location.pathname;
  const clean = (value: string) => value.replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[email]').replace(/\+?\d[\d ()-]{7,}\d/g, '[number]').replace(/\s+/g, ' ').trim().slice(0, 80);
  const hash = (value: string) => { let n = 2166136261; for (const c of value) n = Math.imul(n ^ c.charCodeAt(0), 16777619); return (n >>> 0).toString(36); };
  const emit = (name: string, data: Record<string, string | number>) => {
    if (!allowed()) return;
    const qa = (() => { try { return w.sessionStorage.getItem('nvs-measurement-qa') === '1'; } catch { return false; } })();
    w.gtag?.('event', name, { send_to: GA4_MEASUREMENT_ID, page_path: path, measurement_version: '20261108', measurement_traffic: qa ? 'qa' : 'visitor', ...(qa ? { debug_mode: true, traffic_type: 'qa' } : {}), ...data });
    w.clarity?.('event', name);
  };
  const section = (el: Element | null) => {
    const node = el?.closest('section[id], section[aria-labelledby], article[id], header, footer, nav');
    return clean(node?.getAttribute('data-measure-section') || node?.id || node?.getAttribute('aria-labelledby') || node?.tagName.toLowerCase() || 'main');
  };
  const ctas = new Map<Element, { id: string; label: string; section: string; since: number | null; seen: boolean; clicked: boolean }>();
  const seenCtas = new Set<string>();
  const clickedCtas = new Set<string>();
  const sectionMs = new Map<string, number>();
  const sectionSent = new Map<string, number>();
  let active = 'main', last = now(), foreground = false, started = false, suspended = false, lastFlush = now();
  let lastAction = 'none';
  const currentSection = () => {
    let result = 'main';
    let distance = Infinity;
    for (const el of doc.querySelectorAll('main section[id], main section[aria-labelledby], main article[id], main h2[id]')) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= w.innerHeight || rect.height <= 0 || !measurementVisible(el, w, doc)) continue;
      const center = Math.max(rect.top, 0) + (Math.min(rect.bottom, w.innerHeight) - Math.max(rect.top, 0)) / 2;
      const d = Math.abs(center - w.innerHeight / 2);
      if (d <= distance) { distance = d; result = clean(el.getAttribute('data-measure-section') || el.id || el.getAttribute('aria-labelledby') || 'main'); }
    }
    return result;
  };
  const accrue = () => {
    const t = now();
    if (started && foreground && !suspended && allowed()) sectionMs.set(active, (sectionMs.get(active) || 0) + Math.max(0, t - last));
    last = t;
  };
  const flush = () => {
    accrue();
    for (const [id, ms] of sectionMs) {
      const sent = sectionSent.get(id) || 0;
      const seconds = Math.floor((ms - sent) / 1000);
      if (seconds > 0) { emit('section_attention', { section_id: id, visible_seconds: seconds }); sectionSent.set(id, sent + seconds * 1000); }
    }
    lastFlush = now();
  };
  const scan = () => {
    for (const el of doc.querySelectorAll('a[href], button')) {
      if (ctas.has(el)) continue;
      const excluded = el.closest('[aria-hidden="true"], [data-cookie-consent], #nvs-measurement-qa');
      if (excluded && excluded.getAttribute('data-measure-clone') !== 'true') continue;
      const label = clean(el.getAttribute('data-track-label') || el.getAttribute('aria-label') || el.textContent || el.tagName.toLowerCase());
      const target = el.getAttribute('href') || '';
      ctas.set(el, { id: el.getAttribute('data-track-id') || `cta-${hash(`${path}|${section(el)}|${target ? safeMeasurementPath(target, w.location.origin) : ''}|${label}`)}`, label, section: section(el), since: null, seen: false, clicked: false });
    }
    for (const [index, form] of Array.from(doc.querySelectorAll<HTMLFormElement>('form[data-crm-form]')).entries()) {
      if (ctas.has(form)) continue;
      const redirect = form.querySelector<HTMLInputElement>('[name="redirect"]')?.value;
      const source = redirect ? new URL(redirect, w.location.origin).searchParams.get('source') || 'website-form' : 'website-form';
      ctas.set(form, { id: form.dataset.formId || form.id || `form-${source || index + 1}`, label: 'enquiry form', section: section(form), since: null, seen: false, clicked: false });
    }
  };
  const sample = () => {
    if (!allowed() || !visible() || suspended) { for (const data of ctas.values()) data.since = null; return; }
    scan();
    for (const [el, data] of ctas) {
      if (data.seen || seenCtas.has(data.id)) continue;
      const r = el.getBoundingClientRect();
      const shown = Math.max(0, Math.min(r.bottom, w.innerHeight) - Math.max(r.top, 0));
      const horizontal = Math.max(0, Math.min(r.right, w.innerWidth) - Math.max(r.left, 0));
      if (r.height <= 0 || r.width <= 0 || shown * horizontal < Math.min(r.height, w.innerHeight) * Math.min(r.width, w.innerWidth) * .5 || (el as HTMLElement).hidden || !measurementVisible(el, w, doc)) { data.since = null; continue; }
      data.since ??= now();
      if (now() - data.since >= 1000) {
        data.seen = true; seenCtas.add(data.id);
        emit(el.tagName === 'FORM' ? 'form_view' : 'cta_view', { [el.tagName === 'FORM' ? 'form_id' : 'cta_id']: data.id, element_name: data.label, section_id: data.section });
      }
    }
  };
  const start = () => { if (!started && allowed()) { started = true; last = lastFlush = now(); foreground = visible(); active = currentSection(); scan(); sample(); } };
  doc.addEventListener('nvs:consent-change', () => { accrue(); foreground = false; for (const d of ctas.values()) d.since = null; start(); foreground = allowed() && visible(); last = now(); });
  const update = () => { accrue(); active = currentSection(); sample(); };
  w.addEventListener('scroll', update, { passive: true });
  w.addEventListener('resize', update, { passive: true });
  const visibility = () => { flush(); foreground = visible() && allowed(); last = now(); for (const d of ctas.values()) d.since = null; };
  doc.addEventListener('visibilitychange', visibility);
  w.addEventListener('blur', visibility); w.addEventListener('focus', visibility);
  w.addEventListener('pagehide', () => { flush(); emit('content_exit', { section_id: active, last_action: lastAction }); suspended = true; foreground = false; });
  w.addEventListener('pageshow', () => { suspended = false; last = now(); foreground = allowed() && visible(); active = currentSection(); });
  w.setInterval(() => { if (!started || suspended) return; accrue(); active = currentSection(); sample(); if (now() - lastFlush >= 15000) flush(); }, 1000);
  doc.addEventListener('click', event => {
    if (!allowed()) return;
    const el = (event.target as Element | null)?.closest('a[href], button');
    if (!el) return;
    scan(); const data = ctas.get(el); if (!data) return;
    lastAction = data.id;
    if (!seenCtas.has(data.id)) { data.seen = true; seenCtas.add(data.id); emit('cta_view', { cta_id: data.id, element_name: data.label, section_id: data.section, view_reason: 'interaction' }); }
    emit('content_click', { cta_id: data.id, element_name: data.label, section_id: data.section, first_click: clickedCtas.has(data.id) ? 0 : 1, cta_seen: seenCtas.has(data.id) ? 1 : 0, target_path: safeMeasurementPath(el.getAttribute('href') || path, w.location.origin) });
    data.clicked = true; clickedCtas.add(data.id);
  }, true);

  const videos = new Map<HTMLVideoElement, { time: number; wall: number; playing: boolean; seeking: boolean; ms: number; sent: number; metadata: ReturnType<typeof videoData> }>();
  const videoData = (video: HTMLVideoElement) => ({ video_id: `video-${hash(safeMeasurementPath(video.currentSrc || video.querySelector('source')?.getAttribute('src') || '', w.location.origin))}`, video_title: clean(video.getAttribute('aria-label') || video.title || 'Portfolio video') });
  const flushVideo = (video: HTMLVideoElement, s: { ms: number; sent: number; metadata: ReturnType<typeof videoData> }) => { const seconds = Math.floor((s.ms - s.sent) / 1000); if (seconds > 0) { emit('video_watch', { ...s.metadata, watch_seconds: seconds }); s.sent += seconds * 1000; } };
  const observeVideo = (event: Event) => {
    const video = event.target as HTMLVideoElement;
    if (!started || !allowed() || video.tagName !== 'VIDEO' || video.autoplay || video.loop || !video.controls) return;
    let s = videos.get(video);
    if (!s) { s = { time: video.currentTime, wall: now(), playing: !video.paused && !video.ended, seeking: false, ms: 0, sent: 0, metadata: videoData(video) }; videos.set(video, s); }
    const wall = Math.max(0, (now() - s.wall) / 1000);
    const delta = video.currentTime - s.time;
    const rate = video.playbackRate || 1;
    if (s.playing && !s.seeking && event.type !== 'seeking' && visible() && delta > 0 && delta <= wall * rate + .75) s.ms += Math.min(wall, delta / rate) * 1000;
    s.time = video.currentTime; s.wall = now();
    if (event.type === 'play') s.playing = true;
    if (event.type === 'seeking') { s.seeking = true; emit('video_seek', videoData(video)); }
    if (event.type === 'seeked') s.seeking = false;
    if (event.type === 'pause' || event.type === 'ended') { s.playing = false; flushVideo(video, s); }
    if (s.ms - s.sent >= 15000) flushVideo(video, s);
  };
  // Withdrawal discards unsent state; a later opt-in starts at the current playhead.
  doc.addEventListener('nvs:consent-change', () => { if (!allowed()) videos.clear(); });
  const resetVideo = (event: Event) => { const video = event.target as HTMLVideoElement; const state = videos.get(video); if (state) { flushVideo(video, state); videos.delete(video); } };
  doc.addEventListener('nvs:video-reset', resetVideo, true);
  doc.addEventListener('emptied', resetVideo, true);
  for (const name of ['play', 'pause', 'timeupdate', 'seeking', 'seeked', 'ended']) doc.addEventListener(name, observeVideo, true);
  const videoVisibility = () => { for (const [video, s] of videos) { flushVideo(video, s); s.time = video.currentTime; s.wall = now(); } };
  doc.addEventListener('visibilitychange', videoVisibility);
  w.addEventListener('blur', videoVisibility); w.addEventListener('focus', videoVisibility);
  w.addEventListener('pagehide', () => { for (const [video, s] of videos) flushVideo(video, s); });
  start();
}
