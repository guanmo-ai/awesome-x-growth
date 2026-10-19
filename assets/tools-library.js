export const PURPOSES={discover:'找文章与选题',save:'收藏与素材',write:'写作与排期',review:'数据与复盘',build:'学习开源实现'};
export const LEVELS={official:'官网核验',source:'源码已读',live:'接口实测（含失败）'};
export const SORTS={recommended:'默认推荐',users:'Chrome 用户最多',stars:'GitHub Stars 最多'};
export function selectTools(tools,{q='',purpose='all',openSource=false,sort='recommended'}={}) {
  const terms=q.trim().toLocaleLowerCase().split(/\s+/u).filter(Boolean);
  const found=tools.filter(t=>(purpose==='all'||t.purposes.includes(purpose))&&(!openSource||!!t.repository)&&terms.every(term=>[t.name,t.kind,t.tagline,t.use,t.learn,t.cost,t.license,...t.purposes.map(p=>PURPOSES[p])].join(' ').toLocaleLowerCase().includes(term)));
  // 推荐使用编辑顺序；不同平台的指标不相加。缺失数据始终排在已知数据之后。
  return found.sort((a,b)=>{
    if(!['users','stars'].includes(sort))return Number(Boolean(b.pick))-Number(Boolean(a.pick));
    const value=t=>sort==='users'?t.chromeWebStore?.users:t.github?.stars;
    const av=value(a),bv=value(b);
    if(av==null&&bv==null)return 0;
    if(av==null)return 1;
    if(bv==null)return -1;
    return bv-av;
  });
}
export function toolNeighbors(tools,state,id){const found=selectTools(tools,state),index=found.findIndex(t=>t.id===id);return {index,total:found.length,previous:index>0?found[index-1]:null,next:index>=0&&index<found.length-1?found[index+1]:null};}
export function readToolState(search){const p=new URLSearchParams(search);return {q:p.get('q')||'',purpose:Object.hasOwn(PURPOSES,p.get('purpose'))?p.get('purpose'):'all',openSource:p.get('open')==='1',sort:Object.hasOwn(SORTS,p.get('sort'))?p.get('sort'):'recommended',tool:p.get('tool')||null};}
export function toolHref(state){const p=new URLSearchParams();if(state.q)p.set('q',state.q);if(state.purpose!=='all')p.set('purpose',state.purpose);if(state.openSource)p.set('open','1');if(state.sort!=='recommended')p.set('sort',state.sort);if(state.tool)p.set('tool',state.tool);return './tools.html'+(p.size?'?'+p:'');}
