import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (file) => readFile(file, "utf8");
const html = (route) => read(`dist/${route}index.html`);
const catalogSource = await read("src/config/services.ts");
const services = [...catalogSource.matchAll(/key: "([^"]+)", title: "([^"]+)", href: "([^"]+)"/g)]
  .map(([, key, title, href]) => ({ key, title, href }));
assert.equal(services.length, 9);
assert.equal(new Set(services.map((s) => s.href)).size, 9);

const documents = new Map();
for (const service of services) {
  const document = await html(service.href.slice(1));
  documents.set(service.key, document);
  assert.ok(document.includes(service.title), `Missing canonical service label: ${service.key}`);
  for (const other of services) {
    assert.ok(document.includes(`href="${other.href}"`), `Missing navigation mapping ${service.key} → ${other.key}`);
  }
  const scripts = [...document.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  const nodes = scripts.flatMap(([, text]) => {
    const data = JSON.parse(text);
    return data["@graph"] ?? [data];
  });
  const business = nodes.filter((node) => node["@id"] === "https://www.nextvisionstudio.com/#business");
  assert.equal(business.length, 1, `Duplicate business definition on ${service.key}`);
  assert.deepEqual(business[0].areaServed.map((area) => area.name), ["Dublin", "North Dublin", "Balbriggan", "Swords", "Malahide"]);
  assert.ok(!business[0].address, "Do not publish an unconfirmed physical address");
  const serviceNode = nodes.find((node) => node["@id"] === `https://www.nextvisionstudio.com${service.href}#service`);
  assert.equal(serviceNode?.name, service.title, `Service schema mismatch on ${service.key}`);
}

for (const key of ["video", "photography", "shortform", "corporate"]) {
  const document = documents.get(key);
  assert.ok(document.includes("What shapes your quote?"), `Missing quote explanation: ${key}`);
  assert.ok(document.includes("revision"), `Missing revision scope: ${key}`);
  assert.ok(!/€\s*\d/.test(document), `Concrete service price on ${key}`);
  assert.ok(document.includes("FAQPage"), `Missing visible FAQ markup: ${key}`);
}
assert.ok(documents.get("video").includes('name="service" value="Business Video Production"'));
assert.ok(documents.get("photography").includes('name="service" value="Commercial Photography"'));
assert.ok(documents.get("shortform").includes('name="service" value="Short Form Video Production"'));
assert.match(documents.get("corporate"), /<option[^>]*value="Corporate Video Production"[^>]*selected/);
assert.equal([...documents.get("video").matchAll(/data-business-video="/g)].length, 3);
assert.ok(!/<iframe[^>]*youtube/.test(documents.get("video")), "YouTube must load only after a click");

for (const route of ["", "contact/", "videography-dublin/", "photography-dublin/", "corporate-video-production-dublin/", "short-form-video-production-dublin/"]) {
  const document = await html(route);
  for (const name of ["email", "phone", "message"]) {
    const tag = [...document.matchAll(/<(?:input|textarea)\b[^>]*>/g)].map(([tag]) => tag).find((tag) => tag.includes(`name="${name}"`));
    assert.ok(tag && /\brequired\b/.test(tag), `Missing required ${name}: /${route}`);
  }
}
for (const route of ["case-studies/ventsolve-content-production/", "case-studies/leroys-barking-world-social-content/"]) {
  const document = await html(route);
  assert.ok(document.includes("measurement") || document.includes("measure"), "Case study must separate work from business outcomes");
  assert.ok(document.includes("https://www.nextvisionstudio.com/#peter-gyarmathy"));
}
assert.ok(!/€\s*\d/.test(await html("how-much-does-a-videographer-cost-in-dublin/")), "Cost guide must not publish concrete prices");
console.log("PASS: 9 service mappings, entity consistency, 4 scope/FAQ pages, 3 click-to-play examples, enquiry defaults, required fields and price policy.");
