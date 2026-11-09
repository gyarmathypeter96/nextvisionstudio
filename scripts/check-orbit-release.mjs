import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const baseline=JSON.parse(await readFile('scripts/fixtures/orbit-baseline.json','utf8'));
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#(?:x([\da-f]+)|(\d+));/gi,(_,hex,n)=>String.fromCodePoint(parseInt(hex||n,hex?16:10))).replace(/&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const text=s=>decode(s.replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
const attr=(tag,name)=>tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`,'i'))?.[1];
for(const page of baseline.pages){
 const html=await readFile(`dist${page.route}index.html`,'utf8');
 assert.equal(decode(html.match(/<title>(.*?)<\/title>/s)[1]),page.title,`${page.route}: title`);
 assert.equal(decode(attr(html.match(/<meta\s+name="description"[^>]*>/)[0],'content')),page.description,`${page.route}: description`);
 assert.equal(attr(html.match(/<link\s+rel="canonical"[^>]*>/)[0],'href'),page.canonical,`${page.route}: canonical`);
 assert.deepEqual([...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m=>text(m[1])),page.h1,`${page.route}: H1`);
 assert.ok(!/<meta\s+name="robots"\s+content="[^"]*noindex/.test(html),`${page.route}: indexable release`);
 assert.ok(!html.includes('action="/api/enquiries"')&&!html.includes('Local preview. Enquiries'),`${page.route}: no prototype form`);
 const paths=new Set([...html.matchAll(/<a\b[^>]*>/g)].map(([tag])=>attr(tag,'href')).filter(Boolean).map(href=>new URL(decode(href),page.canonical)).filter(u=>u.hostname==='www.nextvisionstudio.com').map(u=>u.pathname));
 for(const path of page.internalPaths)assert.ok(paths.has(path),`${page.route}: retained link ${path}`);
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,`${page.route}: unique IDs`);
 if(page.route!=='/'){
  const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1].replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/g,'').replace(/<summary\b[^>]*data-orbit-ui[^>]*>[\s\S]*?<\/summary>/g,'')||'';
  const headings=[...main.matchAll(/<h[123]\b[^>]*>([\s\S]*?)<\/h[123]>/g)].map(m=>text(m[1]));assert.deepEqual(headings,page.headings,`${page.route}: original heading structure`);
  // Ignore only whitespace inserted between inline elements by different HTML serializers.
  assert.equal(text(main).replace(/\s/g,''),page.mainText.replace(/\s/g,''),`${page.route}: complete service copy retained`);
 }
}
assert.equal(createHash('sha256').update(await readFile('dist/robots.txt')).digest('hex'),baseline.robotsSha256,'robots.txt: unchanged');
for(const [file,key] of [['src/pages/sitemap.xml.ts','sitemapSourceSha256'],['src/lib/blogPublication.ts','blogPublicationSourceSha256']])assert.equal(createHash('sha256').update(await readFile(file)).digest('hex'),baseline[key],`${file}: original sitemap/publication implementation`);
const sitemap=await readFile('dist/sitemap.xml','utf8');const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
for(const url of baseline.sitemapUrls)assert.ok(urls.includes(url),`Retained sitemap URL ${url}`);
for(const url of urls)assert.ok(baseline.sitemapUrls.includes(url)||baseline.plannedBlogUrls.includes(url),`Unapproved sitemap addition ${url}`);
if(urls.length===baseline.sitemapUrls.length)assert.equal(createHash('sha256').update(sitemap).digest('hex'),baseline.sitemapSha256,'same-date sitemap output: byte-identical');
for(const name of ['earth-layer.webp','astronaut-layer.webp'])await access('dist/orbit/assets/'+name);
const home=await readFile('dist/index.html','utf8');assert.ok(!home.includes('earth-layer.png')&&!home.includes('astronaut-layer.png'));
assert.ok(home.includes('data-track-id="orbit-')&&home.includes('data-measure-section="social-video-work"'));
console.log('PASS: 10 original titles/descriptions/canonicals/H1s and internal link destinations; all service text/headings retained; original sitemap/robots preserved (existing scheduled blog additions allowed); no prototype form or duplicate IDs.');
