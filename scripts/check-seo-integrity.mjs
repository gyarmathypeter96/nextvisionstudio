import assert from 'node:assert/strict';
import {readFile,readdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const origin='https://www.nextvisionstudio.com';
const attr=(s,n)=>s.match(new RegExp(`\\s${n}=["']([^"']*)["']`,'i'))?.[1];
const pages=new Map();
async function collect(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await collect(p);else if(e.name==='index.html'){const route='/'+path.relative('dist',dir).split(path.sep).filter(Boolean).join('/')+(dir==='dist'?'':'/');pages.set(route,await readFile(p,'utf8'));}}}
await collect('dist');
const sitemap=await readFile('dist/sitemap.xml','utf8');const listed=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const links=new Map();let nodes=0;
function inspect(node,route){
 if(Array.isArray(node)){node.forEach(n=>inspect(n,route));return;}if(!node||typeof node!=='object')return;
 const types=[node['@type']].flat();if(node['@type'])nodes++;
 if(types.includes('VideoObject')){
  for(const field of ['name','description','thumbnailUrl','uploadDate'])assert.ok(node[field],`${route}: VideoObject missing ${field}`);
  assert.ok(Number.isFinite(Date.parse(node.uploadDate)),`${route}: invalid video uploadDate`);
  assert.ok(node.contentUrl||node.embedUrl,`${route}: no video playback URL`);
 }
 if(types.some(t=>['Article','BlogPosting','NewsArticle'].includes(t))){
  assert.ok(node.headline&&node.author,`${route}: missing article headline/author`);
  assert.ok(Number.isFinite(Date.parse(node.datePublished)),`${route}: article needs a verified datePublished; otherwise use CreativeWork`);
  if(node.dateModified)assert.ok(Date.parse(node.dateModified)>=Date.parse(node.datePublished),`${route}: modification predates publication`);
 }
 if(types.includes('BreadcrumbList'))node.itemListElement.forEach((item,i)=>{
  assert.equal(item.position,i+1,`${route}: breadcrumb sequence`);
  assert.ok(item.name&&item.item?.startsWith(origin+'/'),`${route}: breadcrumb name/canonical URL`);
 });
 for(const value of Object.values(node))if(value&&typeof value==='object')inspect(value,route);
}
for(const [route,html]of pages){
 assert.equal(attr(html.match(/<meta\b[^>]*property="og:url"[^>]*>/)?.[0]||'','content'),origin+route,`${route}: OG canonical`);
 const targets=new Set();
 for(const [tag]of html.matchAll(/<a\b[^>]*>/g)){
  const href=attr(tag,'href');if(!href)continue;
  let url;try{url=new URL(href.replaceAll('&amp;','&'),origin+route);}catch{continue;}
  if(url.hostname==='nextvisionstudio.com')assert.fail(`${route}: internal link redirects through non-www ${href}`);
  if(url.origin===origin&&pages.has(url.pathname))targets.add(url.pathname);
 }
 links.set(route,targets);
 for(const [,json]of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g))inspect(JSON.parse(json),route);
}
const depth=new Map([['/',0]]);const queue=['/'];for(const route of queue)for(const target of links.get(route)||[])if(!depth.has(target)){depth.set(target,depth.get(route)+1);queue.push(target);}
for(const route of listed)assert.ok(depth.has(route),`${route}: orphan sitemap page`);
for(const route of ['/social-media-content-creation-dublin/','/short-form-video-production-dublin/','/corporate-video-production-dublin/','/photography-dublin/','/how-much-does-a-videographer-cost-in-dublin/'])assert.ok(depth.get(route)<=3,`${route}: service needs <=3 clicks from home`);
const config=JSON.parse(await readFile('vercel.json','utf8'));const redirects=new Map(config.redirects.map(r=>[r.source,r]));assert.equal(redirects.size,config.redirects.length,'Duplicate redirect source');
for(const [source,r]of redirects){assert.equal(r.permanent,true,`${source}: permanent redirect`);assert.ok(!redirects.has(r.destination),`${source}: redirect chain or loop`);assert.ok(pages.has(r.destination)||/\.(xml|txt)$/.test(r.destination),`${source}: redirect has no built destination`);}
console.log(`PASS: ${pages.size} pages, ${nodes} schema nodes, ${listed.length} reachable sitemap URLs; OG URLs, dated articles, video fields, breadcrumbs and one-step route redirects.`);

const reportPath=process.argv.find(arg=>arg.startsWith('--report='))?.slice(9);
if(reportPath)await writeFile(reportPath,JSON.stringify({pages:pages.size,sitemapPages:listed.length,schemaNodes:nodes,routes:[...pages].map(([route,html])=>({route,indexable:listed.includes(route),depth:depth.get(route)??null,title:html.match(/<title>(.*?)<\/title>/)?.[1],description:attr(html.match(/<meta\b[^>]*name="description"[^>]*>/)?.[0]||'','content'),internalDestinations:links.get(route)?.size,mainLinks:(html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1].match(/<a\b/g)||[]).length,imageCount:(html.match(/<img\b/g)||[]).length,emptyAlt:(html.match(/<img\b[^>]*alt=""/g)||[]).length}))},null,2));
