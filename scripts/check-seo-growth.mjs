import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const base = 'https://www.nextvisionstudio.com';
const sitemap = await readFile('dist/sitemap.xml','utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const nodesOf = html => [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(([,s])=>{const n=JSON.parse(s);return n['@graph']??[n];});
const pages = new Map(await Promise.all(urls.map(async url=>{const route=new URL(url).pathname;return [route,await readFile(`dist${route}index.html`,'utf8')];})));
let videos=0;
for(const [route,html] of pages){
 assert.ok(!/>\s*import [^<]*from [^<]*;/.test(html),`${route}: no component import leaked into visible content`);
 const nodes=nodesOf(html);
 const business=nodes.filter(n=>n['@id']===`${base}/#business`);
 assert.equal(business.length,1,`${route}: one business definition`);
 assert.ok(business[0]['@type'].includes('ProfessionalService'),`${route}: service-area identity`);
 assert.equal(business[0].address.addressLocality,'Balbriggan');
 assert.ok(!business[0].address.streetAddress && !business[0].address.postalCode,`${route}: no private street address`);
 assert.ok(!business[0].aggregateRating,`${route}: no self-serving review rating schema`);
 const breadcrumbs=nodes.filter(n=>n['@type']==='BreadcrumbList');
 assert.equal(breadcrumbs.length,route==='/'?0:1,`${route}: one breadcrumb hierarchy`);
 for(const breadcrumb of breadcrumbs){
  const items=breadcrumb.itemListElement;
  assert.equal(items.at(-1).item,base+route,`${route}: breadcrumb canonical`);
  items.forEach((item,i)=>{assert.equal(item.position,i+1);assert.ok(pages.has(new URL(item.item).pathname),`${route}: breadcrumb destination exists`);});
 }
 for(const video of nodes.filter(n=>n['@type']==='VideoObject')){
  videos++;
  for(const key of ['name','description','thumbnailUrl','uploadDate'])assert.ok(video[key],`${route}: video ${key}`);
  assert.ok(Number.isFinite(Date.parse(video.uploadDate)),`${route}: actual video publication date`);
  assert.ok(video.embedUrl||video.contentUrl,`${route}: video source`);
  if(video.embedUrl){const id=new URL(video.embedUrl).pathname.split('/').at(-1);assert.ok(html.includes(`="${id}"`),`${route}: video must have an actual playable facade`);}
 }
 if(route.startsWith('/blog/')&&route!=='/blog/'){
  const article=nodes.find(n=>n['@type']==='BlogPosting');
  assert.ok(article?.author && article.datePublished && article.dateModified,`${route}: article metadata`);
  const body=html.split('class="article-content"')[1]?.split('</article>')[0]??'';
  const targets=new Set([...body.matchAll(/href="(\/(?:corporate-video-production-dublin|short-form-video-production-dublin|social-media-content-creation-dublin|event-videographer-dublin|photography-dublin|webdesigner-dublin|crm-lead-automation-dublin|google-ads-meta-ads-dublin)\/)[^"]*"/g)].map(m=>m[1]));
  assert.ok(targets.size>=3,`${route}: relevant service links in editorial content`);
 }
}
for(const route of ['/corporate-video-production-dublin/','/event-videographer-dublin/','/short-form-video-production-dublin/','/social-media-content-creation-dublin/'])assert.ok(nodesOf(pages.get(route)).some(n=>n['@type']==='VideoObject'),`${route}: playable video schema`);
for(const name of ['swords','malahide','balbriggan']){
 const route=`/videographer-${name}/`;assert.ok(pages.has(route),`${route}: indexable local page`);
 const nodes=nodesOf(pages.get(route));const service=nodes.find(n=>n['@type']==='Service');
 assert.equal(service.provider['@id'],`${base}/#business`);assert.ok(service.areaServed.name.toLowerCase().includes(name));
 assert.ok(!service.address,`${route}: no invented branch office`);
 const sources=[...pages].filter(([r,h])=>r!==route&&h.split('<main')[1]?.split('</main>')[0].includes(`href="${route}"`));
 assert.ok(sources.length>=3,`${route}: discoverable from relevant main content`);
}
for(const slug of ['corporate-video-cost-dublin','product-video-cost-ireland','event-videographer-prices-dublin']){
 const route=`/blog/${slug}/`;assert.ok(pages.has(route));
 assert.ok(pages.get(route).includes('VAT')&&(pages.get(route).includes('Editing is separate')||pages.get(route).includes('editing separate')),`${route}: clear tax and editing scope`);
}
const summary=await readFile('dist/llms.txt','utf8');
for(const name of ['swords','malahide','balbriggan'])assert.ok(summary.includes(`/videographer-${name}/`));
assert.ok(pages.get('/').includes('https://g.page/r/CeqNk_hiVaxOEBM/review'));
console.log(`PASS: ${urls.length} sitemap pages; unique breadcrumbs and private-address safeguards; ${videos} VideoObjects; all blog posts link to relevant services; 3 local pages and 3 pricing guides connected.`);
