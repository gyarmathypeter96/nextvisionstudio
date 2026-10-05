import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { build } from "esbuild";

// Run the actual site scripts against isolated browser fixtures. No request is
// sent to the CRM, GA4, Google Ads, Meta or Clarity by this test suite.
const source = await readFile("src/components/LeadAttribution.astro", "utf8");
const compiled = await build({ stdin: { contents: source.match(/<script>([\s\S]*?)<\/script>/)[1], resolveDir: new URL("../src/components/", import.meta.url).pathname, loader: "ts" }, bundle: true, write: false, platform: "browser", format: "iife" });
const formScript = compiled.outputFiles[0].text;
const html = await readFile("dist/index.html", "utf8");
const inlineScripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(([, script]) => script);
const ownerScript = inlineScripts.find((script) => script.includes('const marker = "nvs-owner-optout"'));
const tagScript = inlineScripts.find((script) => script.includes("script[data-nvs-gtm]"));
assert.ok(ownerScript && tagScript, "Build the website before running measurement checks");
assert.ok(html.indexOf(ownerScript) < html.indexOf(tagScript), "Owner policy must execute before GTM");

const store = (initial = {}) => {
  const values = new Map(Object.entries(initial));
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: (key) => values.delete(key) };
};
function fixture({ url = "https://www.nextvisionstudio.com/videography-dublin/", consent = "granted", owner = false, session = store(), forms = [], response, local } = {}) {
  const localStorage = local ?? store({ "nvs-cookie-consent": consent, ...(owner ? { "nvs-owner-optout": "1" } : {}) });
  const location = new URL(url);
  const redirects = [];
  location.assign = (href) => redirects.push(href);
  const appended = [];
  const requests = [];
  const idle = [];
  const listeners = new Map();
  const document = {
    readyState: "complete", referrer: "", cookie: "",
    querySelector: (selector) => selector === "script[data-nvs-gtm]" ? appended.find((node) => node.dataset.nvsGtm) : null,
    querySelectorAll: () => forms,
    createElement: () => ({ dataset: {}, setAttribute() {}, textContent: "", remove() {} }),
    head: { appendChild: (node) => appended.push(node) },
    addEventListener: (name, callback) => listeners.set(name, callback),
  };
  const window = { location, document, requestIdleCallback: (callback) => idle.push(callback), setTimeout: (callback) => idle.push(callback), addEventListener: (name, callback) => listeners.set(name, callback) };
  const context = vm.createContext({ window, document, localStorage, sessionStorage: session, URL, URLSearchParams, history: { state: null, replaceState() {} }, crypto: { randomUUID: () => `test-key-${requests.length + 1}` }, FormData: class {
    constructor(form) { this.values = new Map(Object.entries(form.values)); }
    get(key) { return this.values.get(key); }
    entries() { return this.values.entries(); }
  }, fetch: async (...args) => {
    requests.push(args);
    return response ? response(...args) : { ok: true, json: async () => ({ submission_id: 123, status: "received" }) };
  }, console, setTimeout });
  vm.runInContext(ownerScript, context);
  vm.runInContext(tagScript, context);
  return { context, window, session, localStorage, appended, requests, idle, redirects, runForms: () => vm.runInContext(formScript, context), leads: () => (window.dataLayer ?? []).filter((item) => item.event === "generate_lead") };
}
function form(redirect = "/quotesend/?source=video") {
  const values = { name: "Synthetic Test", email: "synthetic@example.invalid", phone: "0000000000", service: "Business Video Production", message: "Offline fixture only", consent: "on", redirect, form_type: "Video enquiry" };
  const listeners = new Map();
  const button = { disabled: false, insertAdjacentElement: (_, node) => { instance.status = node; } };
  const instance = {
    values, id: "fixture-form", dataset: {}, action: "https://crm.nextvisionstudio.com/api/sites/nextvisionstudio.com/forms/default/submissions",
    addEventListener: (name, callback) => listeners.set(name, callback),
    reportValidity: () => true,
    reset() {}, appendChild: (node) => { instance.status = node; },
    querySelector: (selector) => {
      if (selector === 'button[type="submit"]') return button;
      if (selector === "[data-crm-form-status]") return instance.status;
      const name = selector.match(/name="([^"]+)"/)?.[1];
      return name && name in values ? { value: values[name] } : null;
    },
    submit: () => listeners.get("submit")({ preventDefault() {} }), button,
  };
  return instance;
}

for (const hostname of ["localhost", "127.0.0.1", "nextvision-preview.vercel.app", "www.nextvisionstudio.com.evil.invalid"]) {
  test(`preview ${hostname}: no tags, no form network requests, no leads`, async () => {
    const f = form(); const env = fixture({ url: `http://${hostname}/videography-dublin/`, forms: [f] });
    env.runForms(); await f.submit();
    assert.equal(env.window.nvsTrackingExcluded, true);
    assert.equal(env.appended.length, 0); assert.equal(env.requests.length, 0); assert.equal(env.leads().length, 0);
    assert.match(f.status.textContent, /No enquiry has been sent/);
  });
}
for (const hostname of ["www.nextvisionstudio.com", "nextvisionstudio.com"]) {
  test(`live ${hostname}: one consented GTM loader`, () => {
    const env = fixture({ url: `https://${hostname}/` });
    env.window.nvsLoadTagManager(); env.window.nvsLoadTagManager();
    assert.equal(env.window.nvsTrackingExcluded, false); assert.equal(env.appended.length, 1);
  });
}
test("owner exclusion persists; no GTM; legitimate live enquiry still reaches CRM but is not measured", async () => {
  const f = form(); const env = fixture({ owner: true, forms: [f] }); env.runForms(); await f.submit();
  assert.equal(env.window.nvsOwnerExcluded, true); assert.equal(env.requests.length, 1);
  assert.equal(env.leads().length, 0); assert.equal(env.appended.length, 0); assert.equal(env.session.getItem("nvs-pending-lead"), null);
  assert.equal(JSON.parse(env.requests[0][1].body).analytics_consent, false);
});
test("query opt out applies before tags; query opt in removes the browser marker", () => {
  const env = fixture({ url: "https://www.nextvisionstudio.com/?nvs_owner_optout=1" });
  assert.equal(env.window.nvsTrackingExcluded, true); assert.equal(env.localStorage.getItem("nvs-owner-optout"), "1");
  const resumed = fixture({ local: env.localStorage, url: "https://www.nextvisionstudio.com/?nvs_owner_optout=0" });
  assert.equal(resumed.window.nvsTrackingExcluded, false); assert.equal(resumed.localStorage.getItem("nvs-owner-optout"), null);
});
test("settings page cannot record the visit used to opt out", () => {
  const env = fixture({ url: "https://www.nextvisionstudio.com/tracking-preferences/" });
  assert.equal(env.window.nvsTrackingExcluded, true); assert.equal(env.window.nvsLoadTagManager, undefined);
});
test("denied consent blocks loader, lead event and attribution, not enquiry delivery", async () => {
  const f = form(); const env = fixture({ consent: "denied", forms: [f] });
  env.window.nvsLoadTagManager(); env.runForms(); await f.submit();
  assert.equal(env.appended.length, 0); assert.equal(env.leads().length, 0); assert.equal(env.requests.length, 1);
  assert.equal(env.session.getItem("nvs-lead-attribution"), null);
});
test("revoked consent is rechecked by an already deferred GTM loader", () => {
  const env = fixture(); env.localStorage.setItem("nvs-cookie-consent", "denied");
  env.idle.forEach((callback) => callback()); assert.equal(env.appended.length, 0);
});
for (const body of [{}, { submission_id: 12, status: "rejected" }, { submission_id: 12, status: "failed" }, { submission_id: 0, status: "received" }]) {
  test(`HTTP success without an accepted CRM receipt is not a lead: ${JSON.stringify(body)}`, async () => {
    const f = form(); const env = fixture({ forms: [f], response: () => ({ ok: true, json: async () => body }) });
    env.runForms(); await f.submit(); assert.equal(env.leads().length, 0); assert.equal(env.redirects.length, 0); assert.equal(f.button.disabled, false);
  });
}
test("HTTP validation failure does not become a lead", async () => {
  const f = form(); const env = fixture({ forms: [f], response: () => ({ ok: false, json: async () => ({ message: "Invalid form" }) }) });
  env.runForms(); await f.submit(); assert.equal(env.leads().length, 0); assert.equal(env.session.getItem("nvs-pending-lead"), null);
});
test("accepted submission is measured once on the thank you page, not the submit page or a refresh", async () => {
  const f = form(); const env = fixture({ forms: [f] }); env.runForms(); await f.submit();
  assert.equal(env.leads().length, 0); assert.equal(env.redirects.length, 1);
  const thanks = fixture({ url: "https://www.nextvisionstudio.com/quotesend/", session: env.session }); thanks.runForms();
  assert.equal(thanks.leads().length, 1); assert.equal(thanks.leads()[0].lead_id, "nvs-form-123");
  assert.equal(thanks.leads()[0].transaction_id, "nvs-form-123"); assert.equal(thanks.leads()[0].crm_submission_status, "received");
  assert.ok(!JSON.stringify(thanks.leads()).includes("synthetic@example.invalid"));
  const refreshed = fixture({ url: "https://www.nextvisionstudio.com/quotesend/", session: env.session }); refreshed.runForms(); assert.equal(refreshed.leads().length, 0);
});
test("double click cannot submit twice; a network retry retains the CRM idempotency key", async () => {
  let release;
  const f = form(); const env = fixture({ forms: [f], response: () => new Promise((resolve) => { release = resolve; }) }); env.runForms();
  const first = f.submit(); await f.submit(); assert.equal(env.requests.length, 1);
  release({ ok: false, json: async () => ({ message: "Temporary error" }) }); await first;
  const retry = f.submit(); assert.equal(env.requests.length, 2);
  assert.equal(env.requests[0][1].headers["Idempotency-Key"], env.requests[1][1].headers["Idempotency-Key"]);
  release({ ok: true, json: async () => ({ submission_id: 123, status: "processed" }) }); await retry;
});
test("a different enquiry after a failure gets a different CRM key", async () => {
  const f = form(); const env = fixture({ forms: [f], response: () => ({ ok: false, json: async () => ({}) }) }); env.runForms(); await f.submit();
  f.values.message = "Different offline fixture"; await f.submit();
  assert.notEqual(env.requests[0][1].headers["Idempotency-Key"], env.requests[1][1].headers["Idempotency-Key"]);
});
test("forms without a redirect use the same receipt ID to prevent a duplicate event", async () => {
  const f = form(""); const env = fixture({ forms: [f] }); env.runForms(); await f.submit(); await f.submit(); assert.equal(env.leads().length, 1);
});
test("opening a thank you URL directly never creates a lead", () => {
  const env = fixture({ url: "https://www.nextvisionstudio.com/quotesend/" }); env.runForms(); assert.equal(env.leads().length, 0);
});
const pending = (overrides = {}) => JSON.stringify({ version: 1, destination: "/quotesend/", expiresAt: Date.now() + 60000, parameters: { lead_id: "nvs-form-123", transaction_id: "nvs-form-123", crm_submission_status: "received" }, ...overrides });
for (const [label, value] of [
  ["expired", pending({ expiresAt: Date.now() - 1000 })],
  ["wrong destination", pending({ destination: "/website-design-quote/thanks/" })],
  ["excessive lifetime", pending({ expiresAt: Date.now() + 3600000 })],
  ["personal data", pending({ parameters: { lead_id: "nvs-form-123", transaction_id: "nvs-form-123", crm_submission_status: "received", email: "synthetic@example.invalid" } })],
  ["legacy unverified payload", JSON.stringify({ form_type: "old" })],
]) {
  test(`invalid pending receipt (${label}) is not measured`, () => {
    const env = fixture({ url: "https://www.nextvisionstudio.com/quotesend/", session: store({ "nvs-pending-lead": value }) }); env.runForms(); assert.equal(env.leads().length, 0);
  });
}
test("a queued receipt on a different page is not prematurely counted or discarded", () => {
  const value = pending(); const env = fixture({ session: store({ "nvs-pending-lead": value }) }); env.runForms();
  assert.equal(env.leads().length, 0); assert.equal(env.session.getItem("nvs-pending-lead"), value);
});
test("deduplication falls back to memory when session storage is blocked", async () => {
  const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } };
  const f = form(""); const env = fixture({ forms: [f], session: blocked }); env.runForms(); await f.submit(); await f.submit(); assert.equal(env.leads().length, 1);
});
