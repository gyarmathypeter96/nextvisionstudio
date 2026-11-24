import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';
// A reproducible local smoke budget, not a CrUX pass or an INP measurement.
// Use the same uncompressed static delivery as the 24-Nov audit baseline.
const routes={home:'/',social:'/social-media-content-creation-dublin/',shortform:'/short-form-video-production-dublin/',pricing:'/how-much-does-a-videographer-cost-in-dublin/',corporate:'/corporate-video-production-dublin/',photography:'/photography-dublin/'};
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4','.json':'application/json','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let p=decodeURIComponent(url.pathname);if(p.endsWith('/'))p+='index.html';const file=path.resolve('dist','.'+p);if(!file.startsWith(path.resolve('dist')+path.sep))throw Error('invalid path');const data=await readFile(file);res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(data);}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;await mkdir('output/performance',{recursive:true});
const run=args=>new Promise((resolve,reject)=>{const child=spawn('npx',['--yes','lighthouse@13.6.0',...args],{stdio:'inherit'});child.once('error',reject);child.once('close',code=>code===0?resolve():reject(Error(`Lighthouse exited ${code}`)));});
try{
 const sitemap=await readFile('dist/sitemap.xml','utf8');
 const publicPaths=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 for(const route of [...publicPaths,'/robots.txt','/sitemap.xml']){
  const response=await fetch(`http://127.0.0.1:${port}${route}`);
  assert.equal(response.status,200,`${route}: built HTTP response`);await response.arrayBuffer();
 }
 assert.equal((await fetch(`http://127.0.0.1:${port}/audit-missing-page/`)).status,404,'Unknown route must return 404');
 console.log(`PASS HTTP: ${publicPaths.length} sitemap pages, robots, sitemap and real 404 response`);
 if(!process.argv.includes('--http-only'))for(const [name,route]of Object.entries(routes))for(const device of ['mobile','desktop']){
  const output=`output/performance/${name}-${device}.json`;
  await run([`http://127.0.0.1:${port}${route}`,'--quiet','--chrome-flags=--headless=new','--only-categories=performance,accessibility,best-practices,seo','--output=json',`--output-path=${path.resolve(output)}`,...(device==='desktop'?['--preset=desktop']:[])]);
  const result=JSON.parse(await readFile(output,'utf8'));const a=result.audits;
  // Home LCP remains a measured optimisation target. Do not hide it behind a 100 score claim.
  const lcpBudget=device==='desktop'?2500:name==='home'?7600:3200;
  assert.ok(a['largest-contentful-paint'].numericValue<=lcpBudget,`${name} ${device}: LCP regression above ${lcpBudget}ms`);
  assert.ok(a['cumulative-layout-shift'].numericValue<=.1,`${name} ${device}: CLS above .1`);
  assert.ok(result.categories.seo.score>=.95,`${name} ${device}: SEO regression`);
  console.log(`PASS ${name} ${device}: LCP ${Math.round(a['largest-contentful-paint'].numericValue)}ms; CLS ${a['cumulative-layout-shift'].numericValue.toFixed(3)}`);
 }
}finally{server.close();}
