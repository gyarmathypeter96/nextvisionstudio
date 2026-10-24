import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { build } from "esbuild";

// Exercise the shipped controller offline, including preferences that browser
// automation cannot emulate here. No CRM or analytics traffic is generated.
const source = await readFile("src/components/BackgroundMotionControl.astro", "utf8");
const compiled = await build({ stdin: { contents: source.match(/<script>([\s\S]*?)<\/script>/)[1], loader: "ts" }, write: false });
const script = compiled.outputFiles[0].text;

function events(properties = {}) {
  const listeners = new Map();
  return Object.assign(properties, {
    addEventListener(name, callback) { listeners.set(name, [...(listeners.get(name) || []), callback]); },
    emit(name) { for (const callback of listeners.get(name) || []) callback(); },
  });
}

function fixture({ reduced = false, play } = {}) {
  const preference = events({ matches: reduced });
  const video = events({ paused: true, calls: 0,
    play() {
      this.calls++;
      if (play) return play();
      this.paused = false;
      this.emit("play");
      return Promise.resolve();
    },
    pause() { this.paused = true; this.emit("pause"); },
  });
  const section = (media, name) => {
    const label = { textContent: "" };
    const button = events({ hidden: true, dataset: { playLabel: `Play ${name}`, pauseLabel: `Pause ${name}` }, querySelector: () => label });
    return { dataset: { motionPaused: "true" }, button, label, querySelector: (selector) => selector === "video" ? media : button };
  };
  const hero = section(video, "background video");
  const logos = section(null, "client logos");
  const document = events({ hidden: false, querySelectorAll: () => [hero, logos] });
  vm.runInNewContext(script, { document, window: { matchMedia: () => preference } });
  return {
    hero, logos, video,
    preference(value) { preference.matches = value; preference.emit("change"); },
    hidden(value) { document.hidden = value; document.emit("visibilitychange"); },
  };
}

test("reduced motion starts with static backgrounds and no video playback request", () => {
  const f = fixture({ reduced: true });
  assert.equal(f.video.calls, 0);
  assert.equal(f.video.paused, true);
  assert.equal(f.hero.button.hidden, true);
  assert.equal(f.logos.button.hidden, true);
  assert.equal(f.logos.dataset.motionPaused, "true");
});

test("video and logo controls pause and resume independently with matching labels", () => {
  const f = fixture();
  assert.equal(f.video.paused, false);
  assert.equal(f.hero.label.textContent, "Pause background video");
  assert.equal(f.logos.label.textContent, "Pause client logos");
  f.hero.button.emit("click");
  assert.equal(f.video.paused, true);
  assert.equal(f.hero.label.textContent, "Play background video");
  assert.equal(f.logos.dataset.motionPaused, "false");
  f.logos.button.emit("click");
  assert.equal(f.logos.dataset.motionPaused, "true");
  assert.equal(f.logos.label.textContent, "Play client logos");
  f.hero.button.emit("click");
  f.logos.button.emit("click");
  assert.equal(f.video.paused, false);
  assert.equal(f.logos.dataset.motionPaused, "false");
});

test("live preference changes stop movement without forgetting a manual pause", () => {
  const f = fixture();
  f.hero.button.emit("click");
  f.preference(true);
  assert.equal(f.video.paused, true);
  assert.equal(f.logos.dataset.motionPaused, "true");
  f.preference(false);
  assert.equal(f.video.paused, true);
  assert.equal(f.hero.button.hidden, false);
  assert.equal(f.hero.label.textContent, "Play background video");
  assert.equal(f.logos.dataset.motionPaused, "false");
});

test("hidden tabs stop both backgrounds and preserve the visitor's manual choice", () => {
  const f = fixture();
  f.logos.button.emit("click");
  f.hidden(true);
  assert.equal(f.video.paused, true);
  assert.equal(f.logos.dataset.motionPaused, "true");
  f.hidden(false);
  assert.equal(f.video.paused, false);
  assert.equal(f.logos.dataset.motionPaused, "true");
});

test("blocked autoplay leaves a working Play control instead of a misleading Pause label", async () => {
  const f = fixture({ play: () => Promise.reject(new Error("autoplay blocked")) });
  await Promise.resolve();
  assert.equal(f.hero.button.hidden, false);
  assert.equal(f.hero.label.textContent, "Play background video");
  assert.equal(f.hero.dataset.motionPaused, "true");
  assert.equal(f.logos.dataset.motionPaused, "false");
});

test("a cancelled old play request cannot override a newer preference state", async () => {
  let reject;
  const f = fixture({ play: () => new Promise((_, fail) => { reject = fail; }) });
  f.preference(true);
  reject(new Error("play cancelled by pause"));
  await Promise.resolve();
  f.preference(false);
  assert.equal(f.video.calls, 2);
  assert.equal(f.hero.button.hidden, false);
});
