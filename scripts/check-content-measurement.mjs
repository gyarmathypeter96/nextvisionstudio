import assert from 'node:assert/strict';
import { test } from 'node:test';
import vm from 'node:vm';
import { build } from 'esbuild';
const compiled = await build({entryPoints:['src/lib/content-measurement.ts'],bundle:true,write:false,platform:'browser',format:'iife',globalName:'Content'});
function fixture(consent='granted') {
 let time=0, focus=true; const calls=[], wl={}, dl={}, ticks=[];
 const section={id:'work',getBoundingClientRect:()=>({top:0,bottom:600,height:600}),getAttribute:()=>null};
 const cta={tagName:'A',textContent:'See work',hidden:false,getAttribute:n=>n==='href'?'/case-studies/':null,closest:s=>s.startsWith('[aria')?null:s.startsWith('section')?section:cta,getBoundingClientRect:()=>({top:100,bottom:150,height:50,left:10,right:110,width:100})};
 const doc={visibilityState:'visible',hasFocus:()=>focus,querySelectorAll:s=>s.startsWith('main section')?[section]:s==='form[data-crm-form]'?[]:[cta],addEventListener:(n,f)=>(dl[n]??=[]).push(f)};
 const storage={getItem:()=>consent}; const w={location:new URL('https://www.nextvisionstudio.com/'),performance:{now:()=>time},innerHeight:800,innerWidth:1200,localStorage:storage,sessionStorage:{getItem:()=>null},gtag:(...args)=>calls.push(args),addEventListener:(n,f)=>(wl[n]??=[]).push(f),setInterval:f=>ticks.push(f)};
 const ctx=vm.createContext({URL,console});vm.runInContext(compiled.outputFiles[0].text,ctx);ctx.Content.initialiseContentMeasurement(w,doc);
 return {w,doc,cta,section,calls,tick:ms=>{time+=ms;ticks.forEach(f=>f())},focus:v=>focus=v,win:(n,e={})=>(wl[n]??[]).forEach(f=>f({...e,type:n})),fire:(n,e={})=>(dl[n]??[]).forEach(f=>f({...e,type:n})),events:n=>calls.filter(c=>c[1]===n).map(c=>c[2])};
}
test('CTA impressions require visibility, deduplicate, and match click identity',()=>{const f=fixture();f.tick(1000);f.tick(1000);assert.equal(f.events('cta_view').length,1);f.fire('click',{target:f.cta});f.fire('click',{target:f.cta});assert.equal(f.events('content_click')[0].cta_id,f.events('cta_view')[0].cta_id);assert.equal(f.events('content_click')[1].first_click,0);f.tick(2000);assert.equal(f.events('cta_view').length,1)});
test('section foreground time does not duplicate pagehide and excludes background',()=>{const f=fixture();f.tick(15000);f.doc.visibilityState='hidden';f.focus(false);f.fire('visibilitychange');f.tick(60000);f.win('pagehide');assert.equal(f.events('section_attention').reduce((s,e)=>s+e.visible_seconds,0),15)});
test('denied consent sends no content or CTA data',()=>{const f=fixture('denied');f.tick(20000);f.fire('click',{target:f.cta});f.win('pagehide');assert.equal(f.calls.length,0)});
test('video watch time excludes seeking and hidden playback',()=>{const f=fixture();const video={tagName:'VIDEO',autoplay:false,loop:false,controls:true,currentTime:0,playbackRate:1,currentSrc:'https://www.nextvisionstudio.com/videos/work.mp4',getAttribute:()=> 'Work video'};f.fire('play',{target:video});f.tick(5000);video.currentTime=5;f.fire('timeupdate',{target:video});video.currentTime=50;f.fire('seeking',{target:video});f.fire('seeked',{target:video});f.tick(2000);video.currentTime=52;f.fire('pause',{target:video});assert.equal(f.events('video_watch').reduce((s,e)=>s+e.watch_seconds,0),7);assert.equal(f.events('video_seek').length,1)});

test('QA detail events remain filterable and use GA4 only',()=>{const f=fixture();f.w.sessionStorage.getItem=()=> '1';f.tick(1000);const event=f.events('cta_view')[0];assert.equal(event.measurement_traffic,'qa');assert.equal(event.debug_mode,true);assert.equal(event.send_to,'G-KNFH3LFFLY')});

test('faded and inert CTAs are not counted as impressions',()=>{
 const f=fixture();f.w.getComputedStyle=()=>({opacity:'0',visibility:'visible',display:'block',pointerEvents:'auto'});
 f.tick(1500);assert.equal(f.events('cta_view').length,0);
 f.w.getComputedStyle=()=>({opacity:'1',visibility:'visible',display:'block',pointerEvents:'auto'});
 f.cta.inert=true;f.tick(1500);assert.equal(f.events('cta_view').length,0);
 f.cta.inert=false;f.tick(1000);f.tick(1000);assert.equal(f.events('cta_view').length,1);
});
test('a covered CTA waits for an uncovered dwell',()=>{
 const f=fixture();f.doc.elementFromPoint=()=>({tagName:'DIV'});f.cta.contains=node=>node===f.cta;
 f.tick(2000);assert.equal(f.events('cta_view').length,0);
 f.doc.elementFromPoint=()=>f.cta;f.tick(1000);f.tick(1000);assert.equal(f.events('cta_view').length,1);
});
test('switching a shared player flushes time against its original film',()=>{
 const f=fixture();let title='Film A';const v={tagName:'VIDEO',autoplay:false,loop:false,controls:true,currentTime:0,playbackRate:1,currentSrc:'https://www.nextvisionstudio.com/videos/a.mp4',getAttribute:()=>title};
 f.fire('play',{target:v});f.tick(5000);v.currentTime=5;f.fire('timeupdate',{target:v});
 f.fire('nvs:video-reset',{target:v});title='Film B';v.currentSrc='https://www.nextvisionstudio.com/videos/b.mp4';v.currentTime=0;f.fire('play',{target:v});f.tick(2000);v.currentTime=2;f.fire('pause',{target:v});
 const rows=f.events('video_watch');assert.equal(rows.length,2);assert.equal(rows[0].watch_seconds,5);assert.equal(rows[0].video_title,'Film A');assert.equal(rows[1].watch_seconds,2);assert.equal(rows[1].video_title,'Film B');assert.notEqual(rows[0].video_id,rows[1].video_id);
});

test('a marquee clone shares its original impression and click identity',()=>{
 const f=fixture();const clone={...f.cta};clone.closest=s=>s.startsWith('[aria')?null:s.startsWith('section')?f.section:clone;
 const original=f.doc.querySelectorAll;f.doc.querySelectorAll=s=>s==='a[href], button'?[f.cta,clone]:original(s);
 f.tick(1000);f.tick(1000);assert.equal(f.events('cta_view').length,1);
 f.fire('click',{target:f.cta});f.fire('click',{target:clone});const clicks=f.events('content_click');assert.equal(clicks[0].cta_id,clicks[1].cta_id);assert.equal(clicks[1].first_click,0);
});

test('video time while consent is withdrawn is never added after accepting again',()=>{
 const f=fixture();const v={tagName:'VIDEO',autoplay:false,loop:false,controls:true,paused:false,ended:false,currentTime:0,playbackRate:1,currentSrc:'https://www.nextvisionstudio.com/videos/a.mp4',getAttribute:()=> 'Film A'};
 f.fire('play',{target:v});f.tick(5000);v.currentTime=5;f.fire('timeupdate',{target:v});
 f.w.localStorage.getItem=()=> 'denied';f.fire('nvs:consent-change');f.tick(60000);v.currentTime=65;f.fire('timeupdate',{target:v});
 f.w.localStorage.getItem=()=> 'granted';f.fire('nvs:consent-change');f.fire('timeupdate',{target:v});f.tick(2000);v.currentTime=67;f.fire('pause',{target:v});
 assert.equal(f.events('video_watch').reduce((n,e)=>n+e.watch_seconds,0),2);
});
