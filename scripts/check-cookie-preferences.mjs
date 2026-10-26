import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile('src/components/CookieConsent.astro','utf8');
const script=source.match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
function fixture(consent) {
 const values={'nvs-cookie-consent':consent};const calls=[],listeners={},cookieWrites=[];let reloads=0;
 const buttons={};for(const key of ['[data-cookie-essential]','[data-cookie-accept]'])buttons[key]={addEventListener:(_,fn)=>buttons[key].click=fn,focus(){}};
 const banner={dataset:{},hidden:true,querySelector:s=>buttons[s]};
 const doc={querySelector:s=>s==='[data-cookie-consent]'?banner:null,addEventListener:(n,fn)=>listeners[n]=fn,dispatchEvent:e=>calls.push(['consent-change',e.detail])};
 Object.defineProperty(doc,'cookie',{get:()=> '_ga=old; _ga_ABC=old; _clck=old; session=keep',set:v=>cookieWrites.push(v)});
 const window={gtag:(...a)=>calls.push(a),clarity:(...a)=>calls.push(a),nvsLoadTagManager:()=>calls.push(['loader'])};
 const location={hostname:'www.nextvisionstudio.com',pathname:'/',hash:'',reload:()=>reloads++};
 vm.runInNewContext(script,{document:doc,window,location,localStorage:{getItem:k=>values[k]??null,setItem:(k,v)=>values[k]=v},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail}}});
 return {banner,values,calls,cookieWrites,buttons,reloads:()=>reloads,open:()=>listeners.click({target:{closest:()=>({})},preventDefault(){}})};
}
test('new visitor sees a usable consent choice and accept updates consent then loads once',()=>{
 const f=fixture(null);assert.equal(f.banner.hidden,false);f.buttons['[data-cookie-accept]'].click();
 assert.equal(f.values['nvs-cookie-consent'],'granted');assert.equal(f.calls.filter(c=>c[0]==='loader').length,1);assert.equal(f.banner.hidden,true);
});
test('existing visitor can reopen choices and withdraw; no unrelated cookies are cleared',()=>{
 const f=fixture('granted');assert.equal(f.banner.hidden,true);f.open();assert.equal(f.banner.hidden,false);f.buttons['[data-cookie-essential]'].click();
 assert.equal(f.values['nvs-cookie-consent'],'denied');assert.equal(f.reloads(),1);assert.equal(f.calls.filter(c=>c[0]==='loader').length,0);
 assert.ok(f.cookieWrites.some(c=>c.startsWith('_ga=;')));assert.ok(f.cookieWrites.some(c=>c.startsWith('_clck=;')));assert.ok(!f.cookieWrites.some(c=>c.startsWith('session=')));
});
test('essential-only choice does not load tags or reload a first visit',()=>{
 const f=fixture(null);f.buttons['[data-cookie-essential]'].click();assert.equal(f.values['nvs-cookie-consent'],'denied');assert.equal(f.reloads(),0);assert.equal(f.calls.filter(c=>c[0]==='loader').length,0);
});
