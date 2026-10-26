import { ANALYTICS_HOSTS, GA4_MEASUREMENT_ID } from "../config/site";

type Parameters = Record<string, string | number | boolean>;
type Clarity = ((...args: unknown[]) => void) & { q?: unknown[][] };
type TrackingWindow = Window & {
  nvsTrackingExcluded?: boolean;
  nvsBehaviorBound?: boolean;
  nvsLoadTagManager?: () => void;
  gtag?: (...args: unknown[]) => void;
  clarity?: Clarity;
};

// Names and paths only: never include form values, URL query strings, fragments,
// click coordinates, visitor identifiers or the contents of the page body.
export function safeMeasurementPath(href: string, origin: string) {
  try {
    const url = new URL(href, origin);
    if (!/^https?:$/.test(url.protocol)) return url.protocol.replace(":", "");
    const path = url.pathname.replace(/[^/]*@[^/]*/g, "redacted");
    return (url.origin === origin ? path : `${url.hostname}${path}`).slice(0, 100);
  } catch { return "unknown"; }
}
const label = (value: string | null | undefined) => (value || "")
  .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, "[email]")
  .replace(/(?:\+?\d[\d ()-]{7,}\d)/g, "[number]")
  .replace(/\s+/g, " ").trim().slice(0, 100);

export function initialiseBehaviorTracking(browser: Window, doc: Document) {
  const w = browser as TrackingWindow;
  if (w.nvsBehaviorBound || !ANALYTICS_HOSTS.includes(w.location.hostname) || w.nvsTrackingExcluded) return;
  w.nvsBehaviorBound = true;
  const allowed = () => {
    try { return !w.nvsTrackingExcluded && w.localStorage.getItem("nvs-cookie-consent") === "granted"; }
    catch { return false; }
  };
  let qa = false;
  try {
    const debugChoice = new URL(w.location.href).searchParams.get("nvs_debug");
    if (debugChoice === "1") w.sessionStorage.setItem("nvs-measurement-qa", "1");
    if (debugChoice === "0") w.sessionStorage.removeItem("nvs-measurement-qa");
    qa = w.sessionStorage.getItem("nvs-measurement-qa") === "1";
  } catch { /* Storage may be blocked; consent remains required. */ }
  const pagePath = w.location.pathname;
  const pageType = pagePath === "/" ? "home" : pagePath.startsWith("/case-studies/") ? "case_study"
    : pagePath.startsWith("/blog/") ? "blog" : "service_or_information";
  const visible = () => doc.visibilityState === "visible" && doc.hasFocus();
  const clock = () => w.performance.now();
  let started = false;
  let startedAt = 0;
  let previousTick = 0;
  let foreground = false;
  let visibleMs = 0;
  let sentVisibleMs = 0;
  let lastScroll: number | null = null;
  let maxScroll = 0;
  let scrollTimer = 0;
  let suspended = false;
  let lastCheckpoint = 0;
  const depths = new Set<number>();
  const sections = new Map<Element, { id: string; since: number | null; sent: boolean }>();
  const nativeVideos = new WeakMap<HTMLVideoElement, { started: boolean; depths: Set<number> }>();
  const qaEvents: string[] = [];
  let qaOutput: HTMLOutputElement | null = null;

  const emit = (name: string, parameters: Parameters = {}, clarityEvent?: string) => {
    if (!allowed() || !w.gtag) return;
    w.gtag("event", name, {
      send_to: GA4_MEASUREMENT_ID,
      page_path: pagePath,
      page_type: pageType,
      content_group: pageType,
      measurement_version: "20261026",
      measurement_traffic: qa ? "qa" : "visitor",
      ...parameters,
      ...(qa ? { debug_mode: true, traffic_type: "qa" } : {}),
    });
    if (clarityEvent) w.clarity?.("event", clarityEvent);
    if (qa) {
      qaEvents.push(`${name} ${JSON.stringify(parameters)}`);
      if (!qaOutput) {
        qaOutput = doc.createElement("output");
        qaOutput.id = "nvs-measurement-qa";
        qaOutput.setAttribute("aria-label", "Measurement QA: queued events, verify receipt in GA4 DebugView");
        qaOutput.style.cssText = "position:fixed;bottom:8px;left:8px;z-index:10000;max-width:min(550px,90vw);max-height:220px;overflow:auto;background:#111;color:#fff;padding:12px;font:11px monospace;white-space:pre-wrap;border:1px solid #9bd2ff";
        doc.body.appendChild(qaOutput);
      }
      qaOutput.textContent = `Measurement QA — QUEUED events (not server receipt)\n${qaEvents.slice(-8).join("\n")}`;
    }
  };
  const sectionId = (element: Element) => label(element.id || element.getAttribute("aria-labelledby") || "main");
  const currentSection = () => {
    let found = "main";
    for (const [element, data] of sections) {
      const box = element.getBoundingClientRect();
      if (box.top <= w.innerHeight * .45 && box.bottom > w.innerHeight * .45) found = data.id;
    }
    return found;
  };
  const scrollPercent = () => {
    const height = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
    return Math.min(100, Math.max(0, Math.round((w.scrollY + w.innerHeight) / Math.max(height, 1) * 100)));
  };
  const sampleScroll = () => {
    const percent = scrollPercent();
    maxScroll = Math.max(maxScroll, percent);
    // Depth = furthest document position visible, as with GA4's 90% event.
    for (const depth of [25, 50, 75, 90, 100]) {
      if (percent >= depth && !depths.has(depth)) {
        depths.add(depth);
        emit("scroll_depth", { scroll_percent: depth, section_id: currentSection() }, `scroll_depth_${depth}`);
      }
    }
  };
  const accrue = () => {
    const now = clock();
    if (started && foreground && !suspended && allowed()) visibleMs += Math.max(0, now - previousTick);
    previousTick = now;
  };
  const checkpoint = (reason: string) => {
    if (!started || !allowed()) return;
    accrue();
    const delta = Math.floor((visibleMs - sentVisibleMs) / 1000);
    if (delta < 1) return; // hidden + pagehide must not double-count a final interval.
    sentVisibleMs += delta * 1000;
    lastCheckpoint = clock();
    emit("page_attention", {
      visible_seconds: delta,
      total_visible_seconds: Math.floor(visibleMs / 1000),
      elapsed_seconds: Math.floor((clock() - startedAt) / 1000),
      max_scroll_percent: maxScroll,
      scroll_percent: scrollPercent(),
      section_id: currentSection(),
      seconds_since_scroll: lastScroll === null ? -1 : Math.floor((clock() - lastScroll) / 1000),
      checkpoint_reason: reason,
    });
  };
  const start = () => {
    if (started || !allowed()) return;
    w.nvsLoadTagManager?.();
    started = true;
    startedAt = previousTick = lastCheckpoint = clock();
    foreground = visible();
    // Queue metadata without adding a second Clarity loader.
    if (!w.clarity) {
      w.clarity = function (...args: unknown[]) { (w.clarity!.q ||= []).push(args); };
    }
    w.clarity("set", "measurement_version", "20261026");
    w.clarity("set", "traffic_type", qa ? "qa" : "visitor");
    w.clarity("set", "page_type", pageType);
    for (const element of doc.querySelectorAll("main section[id], main section[aria-labelledby], main article[id], main h2[id], main > section")) {
      if (element.tagName === "H2" && element.closest("section[id], section[aria-labelledby]")) continue;
      const id = sectionId(element);
      sections.set(element, { id: id === "main" ? `section-${sections.size + 1}` : id, since: null, sent: false });
    }
    emit("measurement_ready", { traffic_type: qa ? "qa" : "visitor" });
    if (foreground) sampleScroll();
  };
  doc.addEventListener("nvs:consent-change", () => {
    if (allowed()) { start(); previousTick = clock(); foreground = visible(); }
    else { foreground = false; previousTick = clock(); }
  });
  w.addEventListener("scroll", () => {
    if (!started || !allowed() || !visible()) return;
    lastScroll = clock();
    sampleScroll();
    w.clearTimeout(scrollTimer);
    scrollTimer = w.setTimeout(() => {
      if (!allowed() || !visible() || suspended) return;
      emit("scroll_stop", { scroll_percent: scrollPercent(), max_scroll_percent: maxScroll,
        section_id: currentSection(), elapsed_seconds: Math.floor((clock() - startedAt) / 1000) }, "scroll_stop");
    }, 1200);
  }, { passive: true });
  const focusChanged = () => {
    checkpoint(doc.visibilityState === "hidden" ? "hidden" : "focus_change");
    foreground = visible(); previousTick = clock();
    if (!foreground) for (const data of sections.values()) data.since = null;
  };
  doc.addEventListener("visibilitychange", focusChanged);
  w.addEventListener("blur", focusChanged);
  w.addEventListener("focus", focusChanged);
  w.addEventListener("pagehide", () => { checkpoint("pagehide"); suspended = true; foreground = false; });
  w.addEventListener("pageshow", () => { suspended = false; previousTick = clock(); foreground = visible(); });
  w.setInterval(() => {
    if (!started || !allowed() || suspended) return;
    accrue();
    foreground = visible();
    if (!foreground) return;
    const now = clock();
    for (const [element, data] of sections) {
      if (data.sent) continue;
      const box = element.getBoundingClientRect();
      const visibleHeight = Math.min(box.bottom, w.innerHeight) - Math.max(box.top, 0);
      if (visibleHeight >= Math.min(box.height, w.innerHeight) * .35 && visibleHeight > 0) {
        data.since ??= now;
        if (now - data.since >= 1000) {
          data.sent = true;
          emit("section_view", { section_id: data.id }, `section_${data.id.replace(/[^a-zA-Z0-9_-]/g, "_")}`);
        }
      } else data.since = null;
    }
    if (now - lastCheckpoint >= 15000) checkpoint("interval");
  }, 1000);
  doc.addEventListener("click", (event) => {
    if (!started || !allowed()) return;
    const target = (event.target as Element | null)?.closest("a[href], button, summary, [role=button]");
    if (!target || target.closest("[data-cookie-consent], #nvs-measurement-qa") || target.getAttribute("disabled") !== null) return;
    const link = target.tagName === "A" ? target.getAttribute("href") : null;
    const name = label(target.getAttribute("data-track-label") || target.getAttribute("aria-label") || target.textContent || target.id || target.tagName.toLowerCase());
    emit("ui_click", { element_name: name, interaction_type: link ? "link" : "button",
      section_id: sectionId(target.closest("section, article, nav, header, footer") || target),
      ...(link ? { target_path: safeMeasurementPath(link, w.location.origin) } : {}) }, "ui_click");
  }, true);
  const videoEvent = (event: Event) => {
    const video = event.target as HTMLVideoElement;
    if (!started || !allowed() || video.tagName !== "VIDEO" || video.autoplay || video.loop || !video.controls) return;
    let state = nativeVideos.get(video);
    if (!state) { state = { started: false, depths: new Set() }; nativeVideos.set(video, state); }
    const parameters = { video_title: label(video.getAttribute("aria-label") || "Portfolio video"),
      video_path: safeMeasurementPath(video.currentSrc || video.querySelector("source")?.getAttribute("src") || "", w.location.origin),
      video_current_time: Math.floor(video.currentTime || 0),
      video_duration: Number.isFinite(video.duration) ? Math.floor(video.duration) : 0 };
    if (event.type === "play" && !state.started) {
      state.started = true; emit("portfolio_video_start", parameters, "portfolio_video_start");
    }
    if (event.type === "pause" && state.started && !video.ended) emit("portfolio_video_pause", parameters);
    if (event.type === "timeupdate" && state.started && Number.isFinite(video.duration) && video.duration > 0) {
      const percent = video.currentTime / video.duration * 100;
      for (const depth of [25, 50, 75]) if (percent >= depth && !state.depths.has(depth)) {
        state.depths.add(depth); emit("portfolio_video_progress", { ...parameters, video_percent: depth });
      }
    }
    if (event.type === "ended" && !state.depths.has(100)) {
      state.depths.add(100); emit("portfolio_video_complete", { ...parameters, video_percent: 100 }, "portfolio_video_complete");
    }
  };
  for (const name of ["play", "pause", "timeupdate", "ended"]) doc.addEventListener(name, videoEvent, true);
  start();
}
