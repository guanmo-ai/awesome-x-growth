export const TOPICS={growth:'涨粉经验',content:'内容创作',engagement:'互动运营',analytics:'数据复盘',platform:'平台规则',monetization:'商业变现'};
export const SHELF_TOPICS=['all',...Object.keys(TOPICS)];
export const RECENT_PERIODS={'30d':30,'90d':90,'365d':365};
export const BOOKMARK_FILTERS=[['all','收藏量不限'],['100','100+ 收藏'],['500','500+ 收藏'],['1000','1000+ 收藏'],['3000','3000+ 收藏']];
export const DEFAULT_SORT='recommended';
const validSort=value=>['recommended','popular','newest'].includes(value);
export const validBookmarks=value=>BOOKMARK_FILTERS.some(([key])=>key===value);
export const validPeriod=value=>Object.hasOwn(RECENT_PERIODS,value);
export function readLibraryState(search){
  const p=new URLSearchParams(search);
  return {q:p.get('q')||'',topic:Object.hasOwn(TOPICS,p.get('topic'))?p.get('topic'):'all',period:validPeriod(p.get('period'))?p.get('period'):'all',bookmarks:validBookmarks(p.get('bookmarks'))?p.get('bookmarks'):'all',sort:validSort(p.get('sort'))?p.get('sort'):DEFAULT_SORT,article:p.get('article')||null};
}
export function libraryHref(state){
  const p=new URLSearchParams();
  for(const key of ['q','topic','period','bookmarks','sort','article']){
    const value=state[key];
    if(!value||(['topic','period','bookmarks'].includes(key)&&value==='all')||(key==='sort'&&(value===DEFAULT_SORT||!validSort(value))))continue;
    if(key==='bookmarks'&&!validBookmarks(value))continue;
    if(key==='period'&&!validPeriod(value))continue;
    p.set(key,value);
  }
  return './'+(p.size?'?'+p:'');
}
export const dateKey=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const publicationCutoff=now=>dateKey(new Date(now.getFullYear()-1,now.getMonth(),now.getDate()));
export const publishedArticles=(articles,now=new Date())=>{
  const today=dateKey(now),cutoff=publicationCutoff(now);
  return articles.filter(a=>a.sourceType==='article'&&a.showcase&&a.language==='zh'&&a.publishedAt>=cutoff&&a.publishedAt<=today);
};
export function recommendationScore(article,now=new Date()){
  const bookmarks=article.socialSnapshot?.bookmarks;
  const published=Date.parse(`${article.publishedAt}T00:00:00Z`),today=Date.parse(`${dateKey(now)}T00:00:00Z`);
  if(!Number.isSafeInteger(bookmarks)||bookmarks<0||!Number.isFinite(published)||!Number.isFinite(today)||published>today)return null;
  const ageDays=(today-published)/86400000;
  // 60天是新鲜度部分的半衰期；35%长期底分保留高收藏旧文的价值信号。
  return Math.log1p(bookmarks)*(0.35+0.65*2**(-ageDays/60));
}
export function selectArticles(articles,state,now=new Date()){
  const q=(state.q||'').trim().toLocaleLowerCase();
  const today=dateKey(now),start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  if(Object.hasOwn(RECENT_PERIODS,state.period))start.setDate(start.getDate()-RECENT_PERIODS[state.period]+1);
  const since=dateKey(start);
  const matchesDate=a=>!validPeriod(state.period)||(a.publishedAt>=since&&a.publishedAt<=today);
  const minimum=validBookmarks(state.bookmarks)&&state.bookmarks!=='all'?Number(state.bookmarks):0;
  const matchesBookmarks=a=>!minimum||(Number.isSafeInteger(a.socialSnapshot?.bookmarks)&&a.socialSnapshot.bookmarks>=minimum);
  const list=publishedArticles(articles,now).filter(a=>matchesDate(a)&&matchesBookmarks(a)&&(!state.topic||state.topic==='all'||a.topics.includes(state.topic))&&(!state.author||state.author==='all'||state.author===a.author.handle)&&(!q||[a.title,a.originalTitle,a.excerpt?.text,...(a.aiSummary?.points||[]).flatMap(p=>[p.title,p.text]),a.author.name,a.author.handle,...a.topics.map(t=>TOPICS[t]||t)].join(' ').toLocaleLowerCase().includes(q)));
  const rank=(a,b)=>(a.shelfOrder||99)-(b.shelfOrder||99);
  const known=(a,b,value)=>{const av=value(a),bv=value(b);return av==null?(bv==null?rank(a,b):1):bv==null?-1:bv-av||rank(a,b);};
  const recommended=(a,b)=>{
    const av=recommendationScore(a,now),bv=recommendationScore(b,now);
    if(av==null&&bv!=null)return 1;
    if(bv==null&&av!=null)return -1;
    return (bv??0)-(av??0)||b.publishedAt.localeCompare(a.publishedAt)||(b.socialSnapshot?.bookmarks??0)-(a.socialSnapshot?.bookmarks??0)||a.id.localeCompare(b.id);
  };
  return list.sort((a,b)=>state.sort==='newest'?known(a,b,x=>x.publishedAt?Date.parse(x.publishedAt):null):state.sort==='selected'?rank(a,b):state.sort==='popular'?known(a,b,x=>Number.isSafeInteger(x.socialSnapshot?.bookmarks)?x.socialSnapshot.bookmarks:null):recommended(a,b));
}
export function articleNeighbors(articles,state,id,now=new Date()){
  const list=selectArticles(articles,state,now),index=list.findIndex(a=>a.id===id);
  return {total:list.length,index,previous:index>0?list[index-1]:null,next:index>=0&&index<list.length-1?list[index+1]:null};
}
