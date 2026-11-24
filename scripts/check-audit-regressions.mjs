import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
const result = await build({entryPoints:['src/lib/analytics-privacy.ts'],bundle:true,write:false,format:'iife',globalName:'Privacy'});
const context = vm.createContext({URL,URLSearchParams});vm.runInContext(result.outputFiles[0].text,context);
const {safeAnalyticsUrl,enquiryIdentity} = context.Privacy;
test('safe campaign URLs preserve marketing attribution but discard personal and private parameters',()=>{
 const url=safeAnalyticsUrl('/contact/?email=private@example.invalid&token=secret&utm_source=google&utm_campaign=event-video&gclid=abc-123#private','https://www.nextvisionstudio.com');
 assert.equal(url,'https://www.nextvisionstudio.com/contact/?utm_source=google&utm_campaign=event-video&gclid=abc-123');
 assert.equal(safeAnalyticsUrl('/?utm_source=private@example.invalid&utm_term=%2B353894797055','https://www.nextvisionstudio.com'),'https://www.nextvisionstudio.com/');
 assert.equal(safeAnalyticsUrl('https://google.com/search?q=private@example.invalid','https://www.nextvisionstudio.com',false),'https://google.com/search');
 assert.equal(safeAnalyticsUrl('mailto:private@example.invalid','https://www.nextvisionstudio.com'),null);
});
test('enquiry retry identity is independent of timing, consent and late analytics identity',()=>{
 const initial={name:'Offline fixture',email:'fixture@example.invalid',service:'Video',message:'An event',form_id:'contact',ga_client_id:undefined,form_duration_seconds:1};
 assert.equal(enquiryIdentity(initial),enquiryIdentity({...initial,ga_client_id:'123.456',ga_session_id:'999',form_duration_seconds:20,analytics_consent:true}));
 assert.notEqual(enquiryIdentity(initial),enquiryIdentity({...initial,message:'Another project'}));
});
test('published enquiry forms allow email-only contact and mask their contents from Clarity',async()=>{
 for(const route of ['','contact/','social-media-content-creation-dublin/','short-form-video-production-dublin/','corporate-video-production-dublin/','photography-dublin/']){
  const html=await readFile(`dist/${route}index.html`,'utf8');
  const forms=[...html.matchAll(/<form\b[^>]*data-crm-form[^>]*>([\s\S]*?)<\/form>/g)];
  assert.ok(forms.length,route);
  for(const [form,body]of forms){
   assert.match(form,/data-clarity-mask="true"/);
   for(const [tag]of body.matchAll(/<input\b[^>]*name="phone"[^>]*>/g))assert.ok(!/\brequired\b/.test(tag),route);
   const email=body.match(/<input\b[^>]*name="email"[^>]*>/)?.[0];assert.match(email||'',/\brequired\b/);
  }
 }
});

test('private acknowledgement and separate Christmas booking keep their deliberate indexability and validation',async()=>{
 const christmas=await readFile('dist/christmas-photoshoot/index.html','utf8');
 assert.match(christmas,/<meta name="robots" content="noindex/);
 assert.match(christmas.match(/<input\b[^>]*name="customer_phone"[^>]*>/)?.[0]||'',/\brequired\b/);
 assert.match(await readFile('dist/quotesend/index.html','utf8'),/<meta name="robots" content="noindex/);
});
