// Content Sprint landing page behaviour: the scroll-driven shoot clock, video
// loops that only play on screen, the posting-plan picker, the video player,
// the three-step request form and the mobile action bar. Form submission
// itself is handled by LeadAttribution.astro (CRM receipt and generate_lead).
import { buildPlan } from "./content-sprint-plan";

const root = document.querySelector<HTMLElement>("[data-sprint]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wide = window.matchMedia("(min-width: 901px)");

if (root) {
  setupLoops();
  setupMorning();
  setupPlan();
  setupPlayer();
  setupForm();
  setupBar();
  setupPain();
  hideExpiredBonus();
}

// Loops load and play only while on screen, so the page stays light.
function setupLoops() {
  const videos = [...root!.querySelectorAll<HTMLVideoElement>("video[data-src]")];
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const video = entry.target as HTMLVideoElement;
      if (entry.isIntersecting) {
        if (!video.src) video.src = video.dataset.src!;
        if (!reduceMotion) video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  }, { rootMargin: "120px 0px" });
  videos.forEach((video) => observer.observe(video));
}

// 09:00 to 13:00 runs with the scroll; each video "arrives" as the clock passes it.
function setupMorning() {
  const section = root!.querySelector<HTMLElement>("[data-morning]");
  const clock = root!.querySelector<HTMLElement>("[data-clock]");
  const track = root!.querySelector<HTMLElement>("[data-track]");
  const steps = [...root!.querySelectorAll<HTMLElement>("[data-step]")];
  const reels = [...root!.querySelectorAll<HTMLElement>("[data-reel]")];
  if (!section || !clock || !track) return;

  const showAll = () => {
    section.classList.remove("is-live");
    clock.textContent = "09:00–13:00";
    track.parentElement!.style.setProperty("--p", "1");
    steps.forEach((step) => step.classList.add("is-on"));
    reels.forEach((reel) => reel.classList.add("is-in"));
  };

  if (reduceMotion) { showAll(); return; }

  let frame = 0;
  const update = () => {
    frame = 0;
    if (!wide.matches) { showAll(); return; }
    section.classList.add("is-live");
    const rect = section.getBoundingClientRect();
    const travel = section.offsetHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, travel)));
    const minutes = Math.round((progress * 240) / 5) * 5;
    const hours = 9 + Math.floor(minutes / 60);
    clock.textContent = `${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    track.parentElement!.style.setProperty("--p", progress.toFixed(3));
    steps.forEach((step, index) => {
      const next = steps[index + 1];
      const start = Number(step.dataset.at);
      const end = next ? Number(next.dataset.at) : 241;
      step.classList.toggle("is-on", minutes >= start && minutes < end);
    });
    // The first video lands as filming starts, the last one just before 13:00.
    reels.forEach((reel, index) => reel.classList.toggle("is-in", progress >= 0.06 + index * 0.11));
  };
  const request = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  wide.addEventListener?.("change", request);
  update();
}

// Posting plan: rebuilt for the visitor's own date so it always shows next
// month; choosing a day shows which video or photo goes out and why.
function setupPlan() {
  const section = root!.querySelector<HTMLElement>("[data-plan]");
  const grid = root!.querySelector<HTMLElement>("[data-plan-grid]");
  const detail = root!.querySelector<HTMLElement>("[data-plan-detail]");
  if (!section || !grid || !detail) return;
  const [when, what, why] = [".cs-plan__when", ".cs-plan__what", ".cs-plan__why"].map((s) => detail.querySelector<HTMLElement>(s)!);

  const plan = buildPlan(new Date());
  const label = root!.querySelector<HTMLElement>("[data-plan-label]");
  if (label && label.textContent !== plan.label) {
    label.textContent = plan.label;
    section.querySelectorAll<HTMLElement>("[data-plan-month]").forEach((node) => { node.textContent = plan.monthName; });
    grid.setAttribute("aria-label", `Example posting plan for ${plan.label}`);
    grid.querySelectorAll(".cs-calendar__blank, .cs-calendar__date, .cs-calendar__post").forEach((cell) => cell.remove());
    for (let i = 0; i < plan.leadingBlanks; i++) {
      const blank = document.createElement("span");
      blank.className = "cs-calendar__blank";
      blank.setAttribute("aria-hidden", "true");
      grid.append(blank);
    }
    let first = true;
    for (const day of plan.days) {
      if (!day.item) {
        const cell = document.createElement("span");
        cell.className = "cs-calendar__date";
        cell.setAttribute("aria-hidden", "true");
        cell.textContent = String(day.day);
        grid.append(cell);
        continue;
      }
      const kind = day.item.kind === "video" ? "Video" : "Photo";
      const button = document.createElement("button");
      button.type = "button";
      button.className = `cs-calendar__post cs-calendar__post--${day.item.kind}`;
      button.setAttribute("aria-pressed", String(first));
      button.dataset.postWhen = `${day.weekday} ${day.day} ${plan.monthName} · ${kind}`;
      button.dataset.postWhat = day.item.title;
      button.dataset.postWhy = day.item.why;
      button.setAttribute("aria-label", `${day.weekday} ${day.day}: ${day.item.kind} — ${day.item.title}`);
      const image = document.createElement("img");
      Object.assign(image, { src: day.item.image, alt: "", loading: "lazy", decoding: "async", width: 540, height: 960 });
      const number = document.createElement("span");
      number.className = "cs-calendar__num";
      number.textContent = String(day.day);
      button.append(image, number);
      grid.append(button);
      if (first) {
        when.textContent = button.dataset.postWhen;
        what.textContent = day.item.title;
        why.textContent = day.item.why;
        first = false;
      }
    }
  }

  grid.addEventListener("click", (event) => {
    const post = (event.target as HTMLElement).closest<HTMLButtonElement>(".cs-calendar__post");
    if (!post) return;
    grid.querySelectorAll(".cs-calendar__post").forEach((other) => other.setAttribute("aria-pressed", String(other === post)));
    when.textContent = post.dataset.postWhen || "";
    what.textContent = post.dataset.postWhat || "";
    why.textContent = post.dataset.postWhy || "";
  });
}

// Full videos open with sound in a dialog.
function setupPlayer() {
  const dialog = root!.querySelector<HTMLDialogElement>("[data-player]");
  const video = root!.querySelector<HTMLVideoElement>("[data-player-video]");
  const title = root!.querySelector<HTMLElement>("[data-player-title]");
  if (!dialog || !video || typeof dialog.showModal !== "function") return;
  root!.querySelectorAll<HTMLButtonElement>("[data-open-video]").forEach((button) => {
    button.addEventListener("click", () => {
      video.src = button.dataset.openVideo!;
      if (title) title.textContent = button.dataset.videoTitle || "";
      dialog.showModal();
      video.play().catch(() => {});
    });
  });
  const close = () => dialog.close();
  root!.querySelector("[data-player-close]")?.addEventListener("click", close);
  dialog.addEventListener("click", (event) => { if (event.target === dialog) close(); });
  dialog.addEventListener("close", () => { video.pause(); video.removeAttribute("src"); video.load(); });
}

// Three steps in one form. Only the last step submits; Enter on an earlier
// step moves forward instead, so LeadAttribution never sees a half-filled form.
function setupForm() {
  const form = root!.querySelector<HTMLFormElement>("#sprint-form");
  if (!form) return;
  const panels = [...form.querySelectorAll<HTMLFieldSetElement>("[data-step-panel]")];
  const tabs = [...form.querySelectorAll<HTMLElement>("[data-tab]")];
  const summary = form.querySelector<HTMLElement>("[data-summary]");
  const names = ["Your business", "Your morning", "Send"];
  let current = 0;

  const fieldsOf = (panel: HTMLElement) =>
    [...panel.querySelectorAll<HTMLInputElement>("input")].filter((input) => input.type !== "hidden");

  const fillSummary = () => {
    if (!summary) return;
    const data = new FormData(form);
    const rows: [string, string][] = [
      ["Morning", String(data.get("preferred_date") || "")],
      ["Business", String(data.get("business_name") || "")],
      ["Name", String(data.get("name") || "")],
      ["Email", String(data.get("email") || "")],
      ["Phone", String(data.get("phone") || "")],
      ["Area", String(data.get("location") || "")],
    ];
    summary.replaceChildren(...rows.filter(([, value]) => value).map(([label, value]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      return row;
    }));
  };

  const show = (index: number) => {
    current = index;
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    tabs.forEach((tab, i) => {
      tab.classList.toggle("is-done", i < index);
      if (i === index) tab.setAttribute("aria-current", "step"); else tab.removeAttribute("aria-current");
    });
    if (index === panels.length - 1) fillSummary();
    form.dispatchEvent(new CustomEvent("nvs:form-step", { detail: { step: index + 1, stepName: names[index] } }));
    panels[index].querySelector<HTMLElement>("input:not([type=hidden]):not([disabled])")?.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  const valid = (panel: HTMLElement) => {
    for (const field of fieldsOf(panel)) {
      if (!field.checkValidity()) { field.reportValidity(); return false; }
    }
    return true;
  };

  form.querySelectorAll<HTMLButtonElement>("[data-next]").forEach((button) => button.addEventListener("click", () => {
    if (valid(panels[current])) show(Math.min(current + 1, panels.length - 1));
  }));
  form.querySelectorAll<HTMLButtonElement>("[data-back]").forEach((button) => button.addEventListener("click", () => show(Math.max(current - 1, 0))));

  // Runs before LeadAttribution's submit handler on the form itself.
  document.addEventListener("submit", (event) => {
    if (event.target !== form || current === panels.length - 1) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (valid(panels[current])) show(current + 1);
  }, true);

}

// Mobile bar and desktop sticky header: visible after the hero, hidden while
// the booking form or the closing call to action is on screen, so neither
// ever covers another button.
function setupBar() {
  const bar = root!.querySelector<HTMLElement>("[data-sprint-bar]");
  const sticky = root!.querySelector<HTMLElement>("[data-sticky]");
  const hero = root!.querySelector<HTMLElement>(".cs-hero");
  const book = root!.querySelector<HTMLElement>("#book");
  const end = root!.querySelector<HTMLElement>(".cs-end");
  if (!bar || !hero || !book || !("IntersectionObserver" in window)) return;
  let heroVisible = true;
  let bookVisible = false;
  let endVisible = false;
  const cookie = document.querySelector<HTMLElement>("[data-cookie-consent]");
  const update = () => {
    const off = heroVisible || bookVisible || endVisible;
    bar.hidden = off;
    if (sticky) {
      sticky.classList.toggle("is-on", !off);
      sticky.inert = off;
    }
    // Sit above the cookie bar while it is open instead of covering it.
    bar.style.setProperty("--cookie-offset", cookie && !cookie.hidden ? `${cookie.offsetHeight}px` : "0px");
  };
  if (cookie) new MutationObserver(update).observe(cookie, { attributes: true, attributeFilter: ["hidden"] });
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; update(); }).observe(hero);
  new IntersectionObserver(([entry]) => { bookVisible = entry.isIntersecting; update(); }, { rootMargin: "0px 0px -15% 0px" }).observe(book);
  if (end) new IntersectionObserver(([entry]) => { endVisible = entry.isIntersecting; update(); }).observe(end);
}

// "Sound familiar?" lines are struck through once the section is on screen.
function setupPain() {
  const pain = root!.querySelector<HTMLElement>("[data-pain]");
  if (!pain) return;
  if (reduceMotion || !("IntersectionObserver" in window)) { pain.classList.add("is-in"); return; }
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    pain.classList.add("is-in");
    observer.disconnect();
  }, { threshold: 0.45 });
  observer.observe(pain);
}

// The build bakes the bonus in; remove it in the browser once it has expired,
// and keep the countdown in the announcement bar current to the minute.
function hideExpiredBonus() {
  const bonuses = [...root!.querySelectorAll<HTMLElement>("[data-bonus]")];
  const tick = () => {
    for (const bonus of bonuses) {
      const left = Date.parse(bonus.dataset.until || "") - Date.now();
      if (!(left > 0)) { bonus.remove(); continue; }
      const timer = bonus.querySelector<HTMLElement>("[data-countdown]");
      if (!timer) continue;
      const days = Math.floor(left / 86_400_000);
      const hours = Math.floor((left % 86_400_000) / 3_600_000);
      const minutes = Math.floor((left % 3_600_000) / 60_000);
      timer.textContent = days > 0 ? `${days}d ${hours}h left` : `${hours}h ${minutes}m left`;
    }
  };
  tick();
  if (bonuses.some((bonus) => bonus.querySelector("[data-countdown]"))) window.setInterval(tick, 30_000);
}
