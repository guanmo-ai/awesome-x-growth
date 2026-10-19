import {TOPICS, BOOKMARK_FILTERS, DEFAULT_SORT, readLibraryState, libraryHref, publishedArticles, selectArticles, articleNeighbors} from './library.js';
import {reduced, reveal, zoomIn, fade, acknowledge, stop} from './motion.js';
import {renderAuthorOpening} from './opening.js';
import {renderArticleNotes} from './article-notes.js';

const $=s=>document.querySelector(s);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=value=>{try{const u=new URL(value);return /^https?:$/.test(u.protocol)?u.href:'#';}catch{return '#';}};
const external=(url,text,cls='',attributes='')=>`<a class="${cls}" href="${esc(safeUrl(url))}" target="_blank" rel="noopener noreferrer" ${attributes}>${text}</a>`;
const paths={like:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',bookmark:'<path d="M6 3h12v18l-6-4-6 4V3Z"/>',comment:'<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>',arrow:'<path d="M7 17 17 7M7 7h10v10"/>'};
const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
const count=value=>value.toLocaleString('en-US');
const date=value=>value?value.slice(0,10).replaceAll('-','.'):'';
const publishedDate=a=>a.publishedAt?`<time class="card-date" datetime="${esc(a.publishedAt)}" aria-label="发布于 ${date(a.publishedAt)}">${date(a.publishedAt)}</time>`:'<span class="card-date">日期未注明</span>';
const originalUrl=a=>a.readingUrl||a.sourceUrl;
const localMedia=value=>/^\.\/assets\/articles\/[a-z0-9-]+\.(jpg|png|webp)$/.test(value||'')?value:'';
const avatar=a=>localMedia(a.presentation?.avatar)?`<img class="avatar" src="${esc(a.presentation.avatar)}" width="28" height="28" alt="" decoding="async">`:`<span class="avatar avatar-fallback" aria-hidden="true">${esc(a.author.name.replace('@','')[0])}</span>`;
const metrics=[['likes','点赞','like'],['bookmarks','收藏','bookmark'],['replies','评论','comment']];
const knownMetrics=a=>metrics.filter(([key])=>Number.isSafeInteger(a.socialSnapshot?.[key])&&a.socialSnapshot[key]>=0);
const metricMarkup=(a,labels=false)=>knownMetrics(a).length?`<div class="card-metrics" role="group" aria-label="原帖互动">${knownMetrics(a).map(([key,label,symbol])=>`<span class="card-metric" aria-label="原帖${label} ${count(a.socialSnapshot[key])} 次">${icon(symbol)}<span>${count(a.socialSnapshot[key])}</span>${labels?`<span class="metric-label">${label}</span>`:''}</span>`).join('')}</div>`:'';
const summaryMarkup=a=>a.aiSummary?.points?.length?`<section class="viewer-summary" aria-labelledby="summary-${a.id}"><h3 id="summary-${a.id}">AI 总结</h3><ol>${a.aiSummary.points.map(p=>`<li><div><h4>${esc(p.title)}</h4><p>${esc(p.text)}</p></div></li>`).join('')}</ol></section>`:'';
const cards=new Map();
let articles=[],viewState,searchTimer,composition=false,activeId=null,viewerOpener=null;
const readState=()=>readLibraryState(location.search);
const href=libraryHref;
function writeState({push=false}={}){history[push?'pushState':'replaceState'](viewState.article?{cardViewer:push||!!history.state?.cardViewer}:null,'',href(viewState));}
function buildCard(a){
  const node=document.createElement('article');node.className='index-card';node.dataset.id=a.id;
  const title=a.originalTitle||a.title,cover=localMedia(a.presentation?.cover);
  node.innerHTML=`<a class="index-select" href="./articles/${a.id}.html" data-open-article="${a.id}" aria-labelledby="title-${a.id}" aria-haspopup="dialog">${cover?`<div class="card-cover"><img src="${esc(cover)}" width="${a.presentation.coverWidth}" height="${a.presentation.coverHeight}" alt="" loading="lazy" decoding="async"></div>`:''}<h2 id="title-${a.id}" title="${esc(title)}">${esc(title)}</h2>${a.presentation?.deck?`<p class="card-guide">${esc(a.presentation.deck)}</p>`:''}</a>
    <div class="card-footer"><div class="card-publication">${external(a.author.url,`@${esc(a.author.handle)}`,'card-handle',`aria-label="${esc(a.author.name)} @${esc(a.author.handle)}" title="${esc(a.author.name)} @${esc(a.author.handle)}"`)}${publishedDate(a)}</div>${metricMarkup(a)}</div>`;
  return node;
}
function renderList({motion=true,initial=false}={}){
  const list=selectArticles(articles,viewState),parent=$('#article-list');
  if(!list.length)parent.innerHTML='<div class="empty-state"><h2>没有找到相关文章</h2><p>试试其他时间范围、主题，或清空关键词。</p><button class="text-link" data-reset>查看全部文章</button></div>';
  else{
    const nodes=list.map((a,index)=>{if(!cards.has(a.id))cards.set(a.id,buildCard(a));const node=cards.get(a.id);const image=node.querySelector('.card-cover img');if(image)image.loading=index<4?'eager':'lazy';return node;});
    parent.replaceChildren(...nodes);
    nodes.forEach(stop);
    if(motion){
      if(initial)nodes.slice(0,12).forEach((node,i)=>reveal(node,{distance:8,delay:Math.min(i*24,144),duration:320}));
      else fade(parent,{duration:180});
    }
  }
  const counter=$('#result-count'),text=`${list.length} 篇文章`,changed=counter.textContent!==text;
  counter.textContent=text;
  if(motion&&changed&&!initial)reveal(counter,{distance:3,duration:180});
  $('#topics').querySelectorAll('[data-topic]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.topic===viewState.topic)));
}
function renderTopics(){
  const topics=[['all','全部'],...Object.entries(TOPICS)].filter(([id])=>id==='all'||articles.some(a=>a.topics.includes(id)));
  $('#topics').innerHTML=topics.map(([id,label])=>`<button class="topic" type="button" data-topic="${id}" aria-pressed="${id===viewState.topic}">${label}<span class="topic-count">${id==='all'?articles.length:articles.filter(a=>a.topics.includes(id)).length}</span></button>`).join('');
}
function renderPeriods(){
  const options=[['all','时间不限'],['30d','近 30 天'],['90d','近 90 天'],['365d','近 365 天']];
  $('#published-period').innerHTML=options.map(([value,label])=>`<option value="${value}">${label}</option>`).join('');
}
function renderBookmarkFilters(){
  $('#bookmark-min').innerHTML=BOOKMARK_FILTERS.map(([value,label])=>`<option value="${value}">${label}</option>`).join('');
}
function syncViewer(){
  const dialog=$('#article-viewer'),a=articles.find(item=>item.id===viewState.article);
  if(!a){
    if(viewState.article){viewState.article=null;writeState();}
    if(dialog.open){const id=activeId;activeId=null;dialog.close();document.body.classList.remove('viewer-open');(viewerOpener?.isConnected?viewerOpener:cards.get(id)?.querySelector('[data-open-article]')||$('#list-heading')).focus({preventScroll:true});}
    return;
  }
  if(activeId===a.id&&dialog.open)return;
  const title=a.originalTitle||a.title,cover=localMedia(a.presentation?.cover),neighbors=articleNeighbors(articles,viewState,a.id);
  $('#viewer-content').innerHTML=`${cover?`<figure class="viewer-cover"><img src="${esc(cover)}" width="${a.presentation.coverWidth}" height="${a.presentation.coverHeight}" alt="${esc(a.presentation.coverAlt||title)}" decoding="async">${a.presentation.coverKind==='article-image'||a.presentation.coverKind==='post-photo'?`<figcaption>原文配图 · ${esc(a.presentation.mediaCredit)}</figcaption>`:''}</figure>`:''}<div class="viewer-body"><h2 id="viewer-title">${esc(title)}</h2><div class="viewer-byline"><div class="card-author">${avatar(a)}${external(a.author.url,`<span>${esc(a.author.name)}</span><small>@${esc(a.author.handle)}</small>`)}</div>${a.publishedAt?`<time class="card-date" datetime="${esc(a.publishedAt)}">${date(a.publishedAt)}</time>`:''}</div>${a.excerpt?.text?`<div class="viewer-excerpt"><blockquote class="opening-text" cite="${esc(safeUrl(a.sourceUrl))}" aria-label="作者原文">${renderAuthorOpening(a.excerpt)}</blockquote></div>`:''}<div class="viewer-bottom">${metricMarkup(a,true)}${external(originalUrl(a),`推荐在 X 阅读原文 ${icon('arrow')}`,'viewer-source',`aria-label="推荐在 X 阅读原文：${esc(title)}"`)}</div>${summaryMarkup(a)}${renderArticleNotes(a)}</div>`;
  $('#viewer-prev').disabled=!neighbors.previous;$('#viewer-next').disabled=!neighbors.next;
  $('#viewer-position').textContent=neighbors.index>=0?`${neighbors.index+1} / ${neighbors.total}`:'1 / 1';
  activeId=a.id;
  if(!dialog.open){document.body.classList.add('viewer-open');dialog.showModal();zoomIn(dialog,{scale:.985,duration:240});}
  else reveal($('#viewer-content'),{distance:4,duration:200});
  dialog.scrollTop=0;
  if(!dialog.contains(document.activeElement)||document.activeElement?.disabled)$('#viewer-close').focus({preventScroll:true});
}
function openViewer(id,opener){if(!articles.some(a=>a.id===id))return;viewerOpener=opener;viewState.article=id;writeState({push:true});syncViewer();}
function closeViewer(){if(history.state?.cardViewer)history.back();else{viewState.article=null;writeState();syncViewer();}}
function stepViewer(direction){const target=articleNeighbors(articles,viewState,activeId)[direction];if(!target)return;viewState.article=target.id;writeState();syncViewer();}
function refresh(options={}){$('#sort').value=viewState.sort;$('#published-period').value=viewState.period;$('#bookmark-min').value=viewState.bookmarks;$('#article-search').value=viewState.q;renderList(options);syncViewer();}
function resetLibrary({home=false}={}){clearTimeout(searchTimer);viewState={q:'',topic:'all',period:'all',bookmarks:'all',sort:DEFAULT_SORT,article:null};writeState();refresh();if(home)window.scrollTo({top:0,behavior:'instant'});else $('#library').scrollIntoView({block:'start',behavior:'instant'});$('#list-heading').focus({preventScroll:true});}
function setFilter(key,value){clearTimeout(searchTimer);viewState.q=$('#article-search').value;viewState[key]=value;writeState();refresh();}
function focusSearch(){if($('#about-dialog').open||$('#article-viewer').open)return;$('#article-search').focus();$('#article-search').scrollIntoView({block:'nearest',behavior:reduced()?'instant':'smooth'});}
$('#article-search').addEventListener('compositionstart',()=>{composition=true;clearTimeout(searchTimer);});
$('#article-search').addEventListener('compositionend',()=>{composition=false;setFilter('q',$('#article-search').value);});
$('#article-search').addEventListener('input',event=>{if(composition)return;clearTimeout(searchTimer);searchTimer=setTimeout(()=>setFilter('q',event.target.value),120);});
$('#sort').addEventListener('change',event=>setFilter('sort',event.target.value));
$('#published-period').addEventListener('change',event=>setFilter('period',event.target.value));
$('#bookmark-min').addEventListener('change',event=>setFilter('bookmarks',event.target.value));
document.addEventListener('click',event=>{
  const target=event.target.closest('button,a');if(!target)return;
  if(target.matches('[data-open-article]')&&event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){event.preventDefault();openViewer(target.dataset.openArticle,target);return;}
  if(target.matches('.about-trigger')){$('#about-dialog').showModal();reveal($('#about-dialog'),{distance:6,duration:240});return;}
  if(target.matches('[data-close-dialog]'))return $('#about-dialog').close();
  if(target.matches('[data-reset]'))return resetLibrary();
  if(target.matches('[data-reload]'))return location.reload();
  if(target.matches('[data-topic]')){setFilter('topic',target.dataset.topic);acknowledge(target);return;}
  if(target.matches('[data-home]')&&event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){event.preventDefault();resetLibrary({home:true});}
});
$('#viewer-close').addEventListener('click',closeViewer);
$('#viewer-prev').addEventListener('click',()=>stepViewer('previous'));
$('#viewer-next').addEventListener('click',()=>stepViewer('next'));
$('#article-viewer').addEventListener('cancel',event=>{event.preventDefault();closeViewer();});
let backdropDown=false;
$('#article-viewer').addEventListener('pointerdown',event=>{const r=event.currentTarget.getBoundingClientRect();backdropDown=event.target===event.currentTarget&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom);});
$('#article-viewer').addEventListener('click',event=>{if(backdropDown&&event.target===event.currentTarget)closeViewer();backdropDown=false;});
$('#about-dialog').addEventListener('click',event=>{if(event.target!==event.currentTarget)return;const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.currentTarget.close();});
document.addEventListener('keydown',event=>{
  if($('#article-viewer').open&&['ArrowLeft','ArrowRight'].includes(event.key)&&!event.defaultPrevented&&!event.isComposing&&!event.altKey&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.target.closest('input,textarea,select,[contenteditable]')){event.preventDefault();if(!event.repeat)stepViewer(event.key==='ArrowLeft'?'previous':'next');return;}
  if((event.key==='k'&&(event.metaKey||event.ctrlKey))||(event.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!document.activeElement.isContentEditable)){event.preventDefault();focusSearch();}
});
window.addEventListener('popstate',()=>{clearTimeout(searchTimer);viewState=readState();refresh({motion:false});});
async function init(){
  viewState=readState();
  try{
    const response=await fetch('./data/articles.json');if(!response.ok)throw new Error('unavailable');articles=publishedArticles(await response.json());
    renderTopics();renderPeriods();renderBookmarkFilters();refresh({initial:true});
  }catch(error){console.error('文库加载失败',error);$('#article-list').innerHTML='<div class="empty-state"><h2>文库暂时未能打开</h2><p>请刷新页面再试。</p><button class="text-link" data-reload>重新加载</button></div>';}
}
init();
