import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {test} from 'node:test';
import {build} from 'esbuild';
const source=await readFile('src/components/MonthlyContentPackages.astro','utf8');
const compiled=await build({stdin:{contents:source.match(/<script>([\s\S]*?)<\/script>/)[1],loader:'ts'},bundle:true,write:false,platform:'browser'});
const script=compiled.outputFiles[0].text;
function fixture(expired=false){
 const listeners={},label={textContent:''},summary={hidden:true,querySelector:()=>label};
 const form={elements:{service:{value:'',dispatchEvent:()=>{}},message:{value:'Please keep the project brief I already wrote.'},content_package:{value:''}},querySelector:()=>summary};
 const link={dataset:{contentPlanName:'Full Monthly Content',contentPlanPrice:'450',blackFriday:'true'},addEventListener:(n,f)=>listeners[n]=f};
 const amount={textContent:'€450'},card={dataset:{regularPrice:'550'},querySelector:s=>s.includes('strong')?amount:link,querySelectorAll:()=>[]};
 form.querySelector=s=>s.includes('service')?form.elements.service:s.includes('content_package')?form.elements.content_package:null;
 const document={querySelector:s=>s==='#contact-form form'?form:s==='[data-package-summary]'?summary:null,querySelectorAll:s=>s.includes('data-content-plan')?[link]:s.includes('data-monthly-plan')?[card]:[]};
 class Clock extends Date{constructor(value){super(value??(expired?'2026-12-02T12:00:00Z':'2026-11-09T12:00:00Z'));}}
 vm.runInNewContext(script,{document,Date:Clock,Event:class{constructor(type){this.type=type}}});
 return{form,link,summary,label,amount,click:()=>listeners.click()};
}
test('choosing a package preserves an existing project brief',()=>{const f=fixture();f.click();assert.equal(f.form.elements.message.value,'Please keep the project brief I already wrote.');assert.equal(f.form.elements.service.value,'Monthly Social Media Content');assert.equal(f.summary.hidden,false)});
test('the active Black Friday package keeps its original CRM context',()=>{const f=fixture();f.click();assert.match(f.form.elements.content_package.value,/EUR 450 per month; Black Friday: 8 edited on-location photos, offer valid until 30 November 2026/)});
test('an expired promotion uses the regular price without stale Black Friday context',()=>{const f=fixture(true);f.click();assert.equal(f.amount.textContent,'€550');assert.equal(f.link.dataset.blackFriday,undefined);assert.equal(f.form.elements.content_package.value,'Full Monthly Content: EUR 550 per month')});
