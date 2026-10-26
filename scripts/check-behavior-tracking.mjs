import assert from 'node:assert/strict';
import { test } from 'node:test';
import vm from 'node:vm';
import { build } from 'esbuild';
const compiled = await build({entryPoints:['src/lib/behavior-tracking.ts'],bundle:true,write:false,platform:'browser',format:'iife',globalName:'Tracking'});
const script = compiled.outputFiles[0].text;
const makeStore = values => ({getItem:k=>values[k]??null,setItem:(k,v)=>values[k]=String(v),removeItem:k=>delete values[k]});
function fixture({consent='granted',hostname='www.nextvisionstudio.com',owner=false,qa=false,sectionElements=[]}={}) {
  let now=0, focus=true;
  const calls=[], docListeners={}, winListeners={}, intervals=[], timers=new Map(), sections=sectionElements;
  let tid=0;
  const doc={visibilityState:'visible',hasFocus:()=>focus,documentElement:{scrollHeight:4000},body:{scrollHeight:4000,appendChild(){}},
    querySelectorAll:()=>sections,addEventListener:(n,fn)=>(docListeners[n]??=[]).push(fn),createElement:()=>({setAttribute(){},style:{},textContent:''})};
  const win={location:new URL(`https://${hostname}/?${qa?'nvs_debug=1':''}`),nvsTrackingExcluded:owner,
    localStorage:makeStore({'nvs-cookie-consent':consent}),sessionStorage:makeStore({}),performance:{now:()=>now},
    innerHeight:800,scrollY:0,gtag:(...args)=>calls.push(args),
    addEventListener:(n,fn)=>(winListeners[n]??=[]).push(fn),setInterval:fn=>intervals.push(fn),
    setTimeout:fn=>{timers.set(++tid,fn);return tid},clearTimeout:id=>timers.delete(id)};
  const context=vm.createContext({URL,console});vm.runInContext(script,context);
  context.Tracking.initialiseBehaviorTracking(win,doc);
  const dispatch=(map,n,event={})=>(map[n]??[]).forEach(fn=>fn({...event,type:n}));
  return {win,doc,calls,sections,init:()=>context.Tracking.initialiseBehaviorTracking(win,doc),
    tick:ms=>{now+=ms;intervals.forEach(fn=>fn())},time:ms=>now+=ms,
    focus:value=>focus=value,fire:(n,e)=>dispatch(winListeners,n,e),fireDoc:(n,e)=>dispatch(docListeners,n,e),
    consent:value=>{win.localStorage.setItem('nvs-cookie-consent',value);dispatch(docListeners,'nvs:consent-change')},
    timers:()=>{const run=[...timers.values()];timers.clear();run.forEach(fn=>fn())},
    events:n=>calls.filter(c=>c[0]==='event'&&c[1]===n).map(c=>c[2]),safePath:context.Tracking.safeMeasurementPath};
}
test('unknown, denied, preview and owner visits send no behavior or Clarity data',()=>{
  for(const options of [{consent:null},{consent:'denied'},{hostname:'localhost'},{owner:true}]){
    const f=fixture(options);f.tick(20000);f.fire('scroll');f.timers();f.fire('pagehide');
    assert.equal(f.calls.length,0);assert.equal(f.win.clarity,undefined);
  }
});
test('late consent starts at consent, without retroactively counting previous reading',()=>{
  const f=fixture({consent:'denied'});f.tick(30000);f.consent('granted');f.tick(15000);
  assert.equal(f.events('measurement_ready').length,1);assert.equal(f.events('page_attention')[0].visible_seconds,15);
  assert.equal(f.events('page_attention')[0].elapsed_seconds,15);
});
test('foreground time excludes background and blur; exit interval is not duplicated',()=>{
  const f=fixture();f.tick(15000);f.time(5000);f.doc.visibilityState='hidden';f.focus(false);f.fireDoc('visibilitychange');
  f.tick(60000);f.fire('pagehide');f.doc.visibilityState='visible';f.focus(true);f.fire('pageshow');f.tick(7000);f.fire('pagehide');
  const events=f.events('page_attention');
  assert.equal(events.reduce((s,e)=>s+e.visible_seconds,0),27);
  assert.equal(events.at(-1).total_visible_seconds,27);assert.equal(events.at(-1).elapsed_seconds,87);
});
test('consent withdrawal blocks further events and excludes withdrawn time after acceptance',()=>{
  const f=fixture();f.tick(10000);f.consent('denied');const before=f.calls.length;
  f.tick(60000);f.fire('scroll');f.timers();assert.equal(f.calls.length,before);
  f.consent('granted');f.tick(15000);f.fire('pagehide');
  assert.equal(f.events('page_attention').reduce((s,e)=>s+e.visible_seconds,0),25);
});
test('scroll milestones fire once; scroll stop has actual depth and time since last scroll',()=>{
  const f=fixture();f.tick(2000);f.win.scrollY=1400;f.fire('scroll');f.win.scrollY=3200;f.fire('scroll');f.fire('scroll');f.timers();
  assert.deepEqual(f.events('scroll_depth').map(e=>e.scroll_percent),[25,50,75,90,100]);
  assert.equal(f.events('scroll_stop').length,1);assert.equal(f.events('scroll_stop')[0].max_scroll_percent,100);
  f.tick(5000);f.fire('pagehide');assert.equal(f.events('page_attention').at(-1).seconds_since_scroll,5);
});
test('initialisation is idempotent and safe paths never contain query, hash or business contact addresses',()=>{
  const f=fixture();f.init();assert.equal(f.events('measurement_ready').length,1);
  assert.equal(f.safePath('/contact/?email=private@example.com#secret','https://www.nextvisionstudio.com'),'/contact/');
  assert.equal(f.safePath('mailto:private@example.com','https://www.nextvisionstudio.com'),'mailto');
  assert.equal(f.safePath('https://example.com/path?secret=123','https://www.nextvisionstudio.com'),'example.com/path');
});
test('interactive click excludes form values and strips URL parameters',()=>{
  const f=fixture();const target={tagName:'A',id:'',textContent:'Contact us',getAttribute:n=>n==='href'?'/contact/?email=private@example.com':null,
    closest:selector=>selector.startsWith('[data-cookie')?null:selector.startsWith('section')?null:target};
  f.fireDoc('click',{target});const event=f.events('ui_click')[0];
  assert.equal(event.element_name,'Contact us');assert.equal(event.target_path,'/contact/');
  assert.ok(!JSON.stringify(f.calls).includes('private@example.com'));
});
test('autoplay backgrounds are excluded; native portfolio progress and completion deduplicate',()=>{
  const f=fixture();const video={tagName:'VIDEO',autoplay:true,loop:true,controls:false,getAttribute:()=>null,currentTime:0,duration:20,currentSrc:'https://www.nextvisionstudio.com/videos/example.mp4'};
  f.fireDoc('play',{target:video});assert.equal(f.events('portfolio_video_start').length,0);
  video.autoplay=video.loop=false;video.controls=true;f.fireDoc('play',{target:video});f.fireDoc('play',{target:video});
  video.currentTime=16;f.fireDoc('timeupdate',{target:video});f.fireDoc('timeupdate',{target:video});f.fireDoc('ended',{target:video});f.fireDoc('ended',{target:video});
  assert.equal(f.events('portfolio_video_start').length,1);assert.equal(f.events('portfolio_video_progress').length,3);assert.equal(f.events('portfolio_video_complete').length,1);
});
test('QA events are explicitly marked and go only to the verified GA4 property',()=>{
  const f=fixture({qa:true});const event=f.events('measurement_ready')[0];
  assert.equal(event.traffic_type,'qa');assert.equal(event.debug_mode,true);assert.equal(event.send_to,'G-KNFH3LFFLY');
});

test('section views require foreground dwell and fire only once',()=>{
  const section={id:'content-packages',getAttribute:()=>null,getBoundingClientRect:()=>({top:0,bottom:500,height:500})};
  const f=fixture({sectionElements:[section]}); f.tick(1000);assert.equal(f.events('section_view').length,0);
  f.tick(1000);assert.equal(f.events('section_view')[0].section_id,'content-packages');
  f.tick(10000);assert.equal(f.events('section_view').length,1);
});
