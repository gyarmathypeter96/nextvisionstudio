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
  assert.equal(business[0]["@type"], "Organization", "Use the address-free organization entity consistently");
  assert.deepEqual(business[0].areaServed.map((area) => area.name), ["Dublin", "North Dublin", "Balbriggan", "Swords", "Malahide", "Donabate", "Portmarnock"]);
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
assert.ok(documents.get("social").includes('name="service" value="Monthly Social Media Content"'));
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
const costGuide = await html("how-much-does-a-videographer-cost-in-dublin/");
assert.ok(costGuide.includes("data-market-price-comparison"), "Alternative budgets must remain a clearly labelled comparison");
assert.equal([...costGuide.matchAll(/data-market-price-example/g)].length, 4);
assert.ok(costGuide.includes("not verified market averages"), "Owner-supplied illustrative budgets must not be advertised as measured market averages");
for (const competitor of ["nexera.ie", "sgstudios.ie", "thrivemarketing.ie", "sesa.ie", "Nexera Studio", "Thrive Marketing", "SESA Media", "SG Studios event filming"]) {
  assert.ok(!costGuide.includes(competitor), `Pricing page must not name or link to a competitor: ${competitor}`);
}
assert.ok(!/"@type":"(?:LocalBusiness|ProfessionalService)"/.test(costGuide), "Cost guide must not redefine an address-free local-business publisher");
assert.equal([...costGuide.matchAll(/data-nextvision-price=/g)].length, 6, "All six owner-approved NextVision options must be visible");
for (const [id, amount, scope] of [
  ["half-day", "€250", "Edited videos are priced separately"],
  ["full-day", "€450", "Edited videos are priced separately"],
  ["eight-edits", "€600", "Editing for 8 short videos"],
  ["twelve-shorts", "€800", "Editing for 12 short videos"],
  ["ultimate-organic", "€1,200", "12 short videos and 4 photos each month"],
  ["ad-creative", "€500", "4 short videos created for paid social ads"],
]) {
  const card = costGuide.match(new RegExp(`<article[^>]*data-nextvision-price="${id}"[\\s\\S]*?<\\/article>`))?.[0];
  assert.ok(card?.includes(amount) && card.includes("+ VAT") && card.includes(scope), `Incorrect approved price or scope for ${id}`);
}
assert.ok(costGuide.includes("All NextVision prices shown exclude VAT"));
const editPrice = (id) => {
  const card = costGuide.match(new RegExp(`<article[^>]*data-nextvision-price="${id}"[\\s\\S]*?<\\/article>`))?.[0];
  return Number(card?.match(/class="own-prices__amount"[^>]*>€([\d,]+)/)?.[1].replaceAll(",", ""));
};
assert.ok(editPrice("twelve-shorts") / 12 < editPrice("eight-edits") / 8, "The 12 video editing package must have a lower per-video price than the 8 video package");
assert.ok(costGuide.includes("€1,050 + VAT combined"), "The filming plus 8 edits comparison must use the updated sum");
const monthlyCard = costGuide.match(/<article[^>]*data-nextvision-price="ultimate-organic"[\s\S]*?<\/article>/)?.[0];
assert.ok(monthlyCard?.includes('href="/social-media-content-creation-dublin/#landing-contact"'), "The managed monthly package must lead to the monthly content enquiry form");
const llms = await read("dist/llms.txt");
for (const amount of ["€250", "€450", "€600", "€800", "€1,200", "€500"]) {
  assert.ok(llms.includes(`${amount} + VAT`), `Public AI summary has a stale or missing approved price: ${amount}`);
}
assert.ok(llms.includes("12 short video edits"), "Public AI summary must identify the 12 video package as editing only");
for (const service of services) assert.ok(llms.includes(`https://www.nextvisionstudio.com${service.href}`), `llms.txt is missing ${service.key}`);
assert.ok(!llms.includes("GTM-") && !llms.includes("nvs_owner_optout"), "llms.txt must contain only public business information");

const videoPage = documents.get("video");
const videoGraph = [...videoPage.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .flatMap(([, text]) => { const schema = JSON.parse(text); return schema["@graph"] ?? [schema]; });
const videoService = videoGraph.find((item) => item["@id"] === "https://www.nextvisionstudio.com/videography-dublin/#service");
assert.deepEqual(videoService.hasOfferCatalog.itemListElement.map((item) => item.itemOffered.name), ["Content Day", "Business Video"], "Schema must describe the same two options as the visible offer cards");
assert.ok(videoPage.includes('id="video-offers"'), "The pricing article needs a stable production-offer destination");
for (const label of ["Content Day", "Business Video", "delivery dates", "included changes"]) {
  assert.ok(videoPage.includes(label), `Missing explicit production option or scope: ${label}`);
}
for (const caseRoute of ["ventsolve-content-production", "leroys-barking-world-social-content"]) {
  assert.ok(videoPage.includes(`href="/case-studies/${caseRoute}/"`), `Missing real project proof: ${caseRoute}`);
}
const offerLink = 'href="/videography-dublin/#video-offers"';
const enquiryLink = 'href="/videography-dublin/#landing-contact"';
assert.ok(costGuide.indexOf(offerLink) < costGuide.indexOf("data-market-price-comparison"), "Readers must see the NextVision offer path before the market price table");
assert.ok(costGuide.includes(enquiryLink), "The pricing guide must lead to the service-specific form");
const blogIndex = await html("blog/");
const newGuides = ["content-day-or-business-video", "compare-business-video-quotes", "customer-questions-into-business-videos"];
for (const slug of newGuides) {
  const route = `/blog/${slug}/`;
  const guide = await html(route.slice(1));
  assert.ok(blogIndex.includes(`href="${route}"`), `New guide missing from the blog list: ${slug}`);
  assert.ok(videoPage.includes(`href="${route}"`), `New guide has no relevant service-page inbound link: ${slug}`);
  assert.ok(guide.includes(enquiryLink), `New guide has no service-specific enquiry path: ${slug}`);
  assert.ok(guide.includes('"@type":"BlogPosting"'), `Missing article schema: ${slug}`);
  assert.ok(guide.includes('"datePublished":"2026-10-18T00:00:00.000Z"'), `Unexpected article publication date: ${slug}`);
  assert.ok(llms.includes(`https://www.nextvisionstudio.com${route}`), `Public guide missing from llms.txt: ${slug}`);
}
console.log("PASS: service mappings, organization entity, scope/FAQ pages, enquiry defaults, approved pricing/VAT, anonymous comparison, buyer journeys and public llms.txt links.");
