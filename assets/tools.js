import {SORTS,selectTools,toolNeighbors,readToolState,toolHref} from './tools-library.js';
import {reveal,zoomIn,fade,acknowledge,stop} from './motion.js';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=v=>{try {const u=new URL(v);return u.protocol==='https:'?u.href:'#';}catch{return '#';}};
const link=(href,label,extra='')=>`<a href="${esc(url(href))}" target="_blank" rel="noopener noreferrer" ${extra}>${label}</a>`;
const number=n=>n.toLocaleString('en-US');
const labels={all:'全部',discover:'找内容',save:'收藏',write:'写作',review:'数据',build:'开源开发'};
let tools=[],state=readToolState(location.search),activeId=null,opener=null,composing=false;
const dialog=$('#tool-viewer');
const visual=t=>t.logo?`<img src="${esc(t.logo.path)}" alt="" width="56" height="56" loading="lazy">`:`<span class="tool-wordmark" aria-hidden="true">${esc(t.name)}</span>`;
function metrics(t,withLinks=false){
  return [[t.chromeWebStore,'users','Chrome 用户'],[t.github,'stars','Stars']].filter(([s])=>s).map(([s,key,label])=>{
    const text=`${number(s[key])} ${label}`,attrs=`class="card-metric" title="采集于 ${esc(s.capturedAt)}"`;
    return withLinks?link(s.url,text,attrs):`<span ${attrs}>${text}</span>`;
  }).join('');
}
function card(t){return `<article class="index-card tool-card" id="${esc(t.id)}"><a class="tool-open" href="${esc(toolHref({...state,tool:t.id}))}" data-open-tool="${esc(t.id)}" aria-haspopup="dialog" aria-labelledby="tool-title-${esc(t.id)}"><div class="card-cover tool-cover">${visual(t)}</div><div class="tool-card-body"><h2 id="tool-title-${esc(t.id)}">${esc(t.name)}</h2><p class="tool-description">${esc(t.tagline)}</p><div class="card-metrics">${metrics(t)}</div><span class="tool-card-action" aria-hidden="true">查看详情 <span>→</span></span></div></a></article>`;}
function render({initial=false,motion=true}={}){
  const found=selectTools(tools,state);
  $('#tool-search').value=state.q;$('#open-source-only').checked=state.openSource;$('#tool-sort').value=state.sort;
  $('#tool-sort').title=state.sort==='recommended'?'按编辑推荐与收录顺序排列':`${SORTS[state.sort]}，无该项数据的工具排在最后`;
  if(!$('#tool-purposes').childElementCount)$('#tool-purposes').innerHTML=Object.entries(labels).map(([id,label])=>`<button class="topic" type="button" data-purpose="${id}" aria-pressed="${state.purpose===id}">${label}</button>`).join('');
  $('#tool-purposes').querySelectorAll('[data-purpose]').forEach(b=>b.setAttribute('aria-pressed',String(state.purpose===b.dataset.purpose)));
  $('#tool-count').textContent=`${found.length} 个工具`;
  $('#tool-list').innerHTML=found.length?found.map(card).join(''):'<div class="empty-state"><p>没有匹配的工具</p><button type="button" class="text-link" data-reset-tools>查看全部工具</button></div>';
  if(motion){
    stop($('#tool-list'));
    if(initial)$('#tool-list').querySelectorAll('.tool-open').forEach((el,i)=>reveal(el,{distance:14,delay:Math.min(i*35,175),duration:420}));
    else fade($('#tool-list'),{duration:180});
  }
}
function writeState(push=false){history[push?'pushState':'replaceState'](push?{toolViewer:true}:history.state,'',toolHref(state));}
function syncViewer(){
  const t=tools.find(t=>t.id===state.tool);
  if(!t){
    if(state.tool){state.tool=null;writeState();}
    if(dialog.open){const id=activeId;activeId=null;stop(dialog);stop($('#tool-viewer-content'));dialog.close();document.body.classList.remove('viewer-open');(opener?.isConnected?opener:document.querySelector(`[data-open-tool="${id}"]`)||$('#tools-heading')).focus({preventScroll:true});}
    return;
  }
  if(activeId===t.id&&dialog.open)return;
  const p=t.preview,n=toolNeighbors(tools,state,t.id),entry=t.chromeWebStore?.url||t.url;
  $('#tool-viewer-content').innerHTML=`<div class="tool-identity"><div class="tool-detail-logo">${visual(t)}</div><div><h2 id="tool-viewer-title">${esc(t.name)}</h2><p>${esc(t.kind)}</p></div></div><div class="card-metrics tool-detail-metrics">${metrics(t,true)}</div><section class="tool-official"><h3>官方介绍节选</h3><blockquote lang="en">${esc(p.official.text)}</blockquote><p class="tool-source">${link(p.official.url,esc(p.official.label)+' ↗')}</p></section><section class="tool-ai"><h3>AI 总结</h3><ul>${p.summary.map(point=>`<li>${esc(point)}</li>`).join('')}</ul></section><dl class="tool-facts"><div><dt>费用</dt><dd>${esc(p.pricing)}</dd></div><div><dt>使用方式</dt><dd>${esc(p.setup)}</dd></div><div><dt>使用条件</dt><dd>${esc(t.access)}</dd></div><div><dt>核验范围</dt><dd>${esc(t.evidence)}</dd></div><div><dt>使用边界</dt><dd>${esc(t.limitation)}</dd></div></dl>`;
  $('#tool-viewer-actions').innerHTML=`${link(entry,t.chromeWebStore?'前往 Chrome 商店 ↗':t.repository===entry?'查看安装文档 ↗':'访问官网 ↗','class="tool-primary-action"')}${t.repository&&t.repository!==entry?link(t.repository,'GitHub ↗'):''}<span>介绍核验于 ${esc(t.checkedAt)}</span>`;
  $('#tool-prev').disabled=!n.previous;$('#tool-next').disabled=!n.next;$('#tool-position').textContent=n.index>=0?`${n.index+1} / ${n.total}`:'1 / 1';
  activeId=t.id;
  if(!dialog.open){document.body.classList.add('viewer-open');dialog.showModal();zoomIn(dialog,{scale:.96,duration:320});}
  else reveal($('#tool-viewer-content'),{distance:8,duration:240});
  dialog.scrollTop=0;
  if(!dialog.contains(document.activeElement)||document.activeElement.disabled)$('#tool-close').focus({preventScroll:true});
}
function update(){writeState();render();syncViewer();}
function closeViewer(){if(history.state?.toolViewer)history.back();else{state.tool=null;writeState();syncViewer();}}
function stepViewer(direction){const t=toolNeighbors(tools,state,activeId)[direction];if(t){state.tool=t.id;writeState();syncViewer();}}
$('#tool-purposes').addEventListener('click',e=>{const b=e.target.closest('[data-purpose]');if(b&&state.purpose!==b.dataset.purpose){state.purpose=b.dataset.purpose;update();acknowledge(b);}});
$('#tool-search').addEventListener('compositionstart',()=>{composing=true;});
$('#tool-search').addEventListener('compositionend',e=>{composing=false;state.q=e.target.value;update();});
$('#tool-search').addEventListener('input',e=>{if(!composing){state.q=e.target.value;update();}});
$('#open-source-only').addEventListener('change',e=>{state.openSource=e.target.checked;update();});
$('#tool-sort').addEventListener('change',e=>{state.sort=e.target.value;update();});
$('#tool-list').addEventListener('click',e=>{
  const a=e.target.closest('[data-open-tool]');
  if(a&&e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();opener=a;state.tool=a.dataset.openTool;writeState(true);syncViewer();return;}
  if(e.target.closest('[data-reset-tools]')){state={...state,q:'',purpose:'all',openSource:false,tool:null};update();$('#tool-search').focus();}
});
$('#tool-close').addEventListener('click',closeViewer);
$('#tool-prev').addEventListener('click',()=>stepViewer('previous'));
$('#tool-next').addEventListener('click',()=>stepViewer('next'));
dialog.addEventListener('cancel',e=>{e.preventDefault();closeViewer();});
let backdropDown=false;
dialog.addEventListener('pointerdown',e=>{const r=dialog.getBoundingClientRect();backdropDown=e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom);});
dialog.addEventListener('click',e=>{if(backdropDown&&e.target===dialog)closeViewer();backdropDown=false;});
dialog.addEventListener('keydown',e=>{
  if(e.key==='Tab'){
    const focusable=[...dialog.querySelectorAll('button:not(:disabled),a[href]')],first=focusable[0],last=focusable.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
    return;
  }
  if(['ArrowLeft','ArrowRight'].includes(e.key)&&!e.repeat&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey){e.preventDefault();stepViewer(e.key==='ArrowLeft'?'previous':'next');}
});
window.addEventListener('popstate',()=>{state=readToolState(location.search);render({motion:false});syncViewer();});
async function init(){try{const r=await fetch('./data/tools.json');if(!r.ok)throw new Error(`HTTP ${r.status}`);tools=await r.json();render({initial:true});syncViewer();}catch(e){console.error('工具库加载失败',e);$('#tool-count').textContent='工具库未能加载';$('#tool-list').innerHTML='<p class="empty-state">请刷新重试，或阅读<a href="./docs/TOOLS.md">工具目录</a>。</p>';}}
init();
