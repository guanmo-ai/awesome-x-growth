import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validPeriod,readLibraryState,libraryHref,publishedArticles,selectArticles,articleNeighbors,publicationCutoff} from '../assets/library.js';
const article=(id,extra={})=>({id,title:id,sourceType:'article',showcase:true,language:'zh',publishedAt:publicationCutoff(new Date()),author:{name:'作者',handle:id},summary:'冷启动与内容创作',topics:['growth'],takeaways:[],shelfOrder:9,...extra});
const ids=list=>list.map(a=>a.id);
test('数据复盘和平台规则可筛选、搜索并通过地址恢复',()=>{
  const articles=[article('analysis',{topics:['analytics']}),article('rules',{topics:['platform']}),article('growth')];
  for(const [topic,label,id] of [['analytics','数据复盘','analysis'],['platform','平台规则','rules']]){
    const state=readLibraryState(`?topic=${topic}`);
    assert.equal(state.topic,topic);
    assert.deepEqual(ids(selectArticles(articles,state)),[id]);
    assert.deepEqual(ids(selectArticles(articles,{q:label})),[id]);
    assert.equal(readLibraryState(new URL(libraryHref(state),'https://example.test').search).topic,topic);
  }
});
test('原型属性不能作为合法主题导致全部文章消失',()=>{
  for(const topic of ['constructor','__proto__','toString','hasOwnProperty']){
    const state=readLibraryState(`?topic=${topic}`);
    assert.equal(state.topic,'all');
    assert.deepEqual(ids(selectArticles([article('visible')],state)),['visible']);
  }
});
test('可见 AI 总结可被搜索，隐藏阅读笔记仍不参与搜索',()=>{
  const articles=[article('visible',{aiSummary:{points:[{title:'同一账号的基线',text:'用中位数观察内容表现'}]},summary:'隐藏旧导读',sections:[{heading:'旧笔记',body:'隐藏练习'}]})];
  assert.deepEqual(ids(selectArticles(articles,{q:'同一账号的基线'})),['visible']);
  assert.deepEqual(ids(selectArticles(articles,{q:'中位数'})),['visible']);
  assert.deepEqual(ids(selectArticles(articles,{q:'隐藏旧导读'})),[]);
  assert.deepEqual(ids(selectArticles(articles,{q:'隐藏练习'})),[]);
});
test('原帖收藏排序区分零收藏与未采集，未知数值始终排最后',()=>{
  const articles=[article('unknown',{shelfOrder:1}),article('zero',{socialSnapshot:{bookmarks:0}}),article('popular',{socialSnapshot:{bookmarks:120}})];
  assert.deepEqual(ids(selectArticles(articles,{sort:'popular'})),['popular','zero','unknown']);
});
test('综合推荐优先有收藏积累的文章，不因刚发布就让低收藏排前面',()=>{
  const now=new Date('2026-10-18T12:00:00Z');
  const articles=[
    article('brand-new',{publishedAt:'2026-10-18',socialSnapshot:{bookmarks:2}}),
    article('recent-proven',{publishedAt:'2026-10-11',socialSnapshot:{bookmarks:100}}),
    article('older-classic',{publishedAt:'2025-10-18',socialSnapshot:{bookmarks:5000}}),
    article('new-small',{publishedAt:'2026-10-11',socialSnapshot:{bookmarks:20}})
  ];
  assert.deepEqual(ids(selectArticles(articles,{},now)),['recent-proven','older-classic','new-small','brand-new']);
  assert.deepEqual(ids(selectArticles(articles,{sort:'popular'},now)),['older-classic','recent-proven','new-small','brand-new']);
  assert.deepEqual(ids(selectArticles(articles,{sort:'newest'},now)),['brand-new','recent-proven','new-small','older-classic']);
});
test('综合推荐同时响应收藏和发布时间，不使用入库时间或人工顺序加分',()=>{
  const now=new Date('2026-10-18T12:00:00Z');
  const articles=[
    article('older',{publishedAt:'2026-07-18',socialSnapshot:{bookmarks:100},shelfOrder:1}),
    article('more',{publishedAt:'2026-10-11',socialSnapshot:{bookmarks:200},shelfOrder:999}),
    article('fewer',{publishedAt:'2026-10-11',socialSnapshot:{bookmarks:100},shelfOrder:2,checkedAt:'2026-10-18'})
  ];
  assert.deepEqual(ids(selectArticles(articles,{sort:'recommended'},now)),['more','fewer','older']);
});
test('综合推荐区分零收藏与未知，同分以日期和ID稳定排序',()=>{
  const now=new Date('2026-10-18T12:00:00Z');
  const articles=[
    article('unknown',{publishedAt:'2026-10-18',shelfOrder:1}),
    article('zero-old',{publishedAt:'2026-10-01',socialSnapshot:{bookmarks:0}}),
    article('zero-new',{publishedAt:'2026-10-18',socialSnapshot:{bookmarks:0}}),
    article('b',{publishedAt:'2026-10-11',socialSnapshot:{bookmarks:100},shelfOrder:1}),
    article('a',{publishedAt:'2026-10-11',socialSnapshot:{bookmarks:100},shelfOrder:999})
  ];
  const expected=['a','b','zero-new','zero-old','unknown'];
  assert.deepEqual(ids(selectArticles(articles,{sort:'recommended'},now)),expected);
  assert.deepEqual(ids(selectArticles([...articles].reverse(),{sort:'recommended'},now)),expected);
});
test('综合推荐为默认，手动收藏和最新排序通过地址完整恢复',()=>{
  assert.equal(readLibraryState('').sort,'recommended');
  assert.equal(readLibraryState('?sort=invalid').sort,'recommended');
  for(const sort of ['recommended','popular','newest']){
    const state={q:'作者',topic:'growth',period:'90d',bookmarks:'100',sort,article:'example'};
    assert.deepEqual(readLibraryState(new URL(libraryHref(state),'https://example.test').search),state);
  }
  assert.equal(libraryHref({sort:'recommended'}),'./');
  assert.equal(libraryHref({sort:'popular'}),'./?sort=popular');
});
test('综合推荐中的前后篇与当前筛选、搜索及收藏门槛一致',()=>{
  const now=new Date('2026-10-18T12:00:00Z');
  const a=(id,fields)=>article(id,{publishedAt:'2026-10-11',socialSnapshot:{bookmarks:200},...fields});
  const articles=[a('one'),a('two',{socialSnapshot:{bookmarks:100}}),a('below',{socialSnapshot:{bookmarks:99}}),a('other',{topics:['content']}),a('old',{publishedAt:'2026-06-01'}),a('hidden',{showcase:false})];
  const state={sort:'recommended',topic:'growth',period:'30d',bookmarks:'100',q:'作者'};
  assert.deepEqual(ids(selectArticles(articles,state,now)),['one','two']);
  assert.equal(articleNeighbors(articles,state,'one',now).next.id,'two');
  assert.equal(articleNeighbors(articles,state,'two',now).previous.id,'one');
  for(const id of ['below','other','old','hidden'])assert.equal(articleNeighbors(articles,state,id,now).index,-1);
});
test('发布时间排序只包含最近一年有明确日期的记录',()=>{
  const articles=[article('unknown',{shelfOrder:1}),article('older',{publishedAt:'2026-09-24'}),article('newer',{publishedAt:'2026-10-02'})];
  articles[0].publishedAt=null;
  assert.deepEqual(ids(selectArticles(articles,{sort:'newest'},new Date('2026-10-13T12:00:00Z'))),['newer','older']);
});
test('时间不限、旧年份链接和搜索都不能绕过一年收录上限',()=>{
  const now=new Date('2026-10-13T12:00:00Z');
  const articles=[article('boundary',{publishedAt:'2025-10-13'}),article('expired',{publishedAt:'2025-10-12'}),article('future',{publishedAt:'2026-10-14'})];
  assert.deepEqual(ids(publishedArticles(articles,now)),['boundary']);
  assert.deepEqual(ids(selectArticles(articles,{period:'all',q:'expired'},now)),[]);
  assert.deepEqual(ids(selectArticles(articles,{period:'year-2025'},now)),['boundary']);
});
test('近 30 天包含起止日，排除更早、未来和未知日期',()=>{
  const articles=['2026-09-13','2026-09-14','2026-10-13','2026-10-14',null].map((publishedAt,i)=>article(String(i),{publishedAt}));
  assert.deepEqual(ids(selectArticles(articles,{period:'30d'},new Date('2026-10-13T23:30:00Z'))),['2','1']);
  assert.equal(selectArticles(articles,{period:'all'},new Date('2026-10-13T23:30:00Z')).length,3);
});
test('时间筛选跨年与闰日正常，依据发布时间',()=>{
  const articles=[article('leap',{publishedAt:'2024-02-29'}),article('old',{publishedAt:'2025-12-31'}),article('new',{publishedAt:'2026-01-01',checkedAt:'2025-12-31'}),article('unknown',{publishedAt:null})];
  assert.deepEqual(ids(selectArticles(articles,{period:'30d'},new Date('2024-03-29T12:00:00Z'))),['leap']);
  assert.deepEqual(ids(selectArticles(articles,{period:'90d'},new Date('2026-01-01T12:00:00Z'))),['new','old']);
});
test('发布时间与主题、搜索、排序组合，预览只切换范围内文章',()=>{
  const articles=[article('old',{publishedAt:'2025-12-31'}),article('new',{publishedAt:'2026-01-01'}),article('other',{publishedAt:'2026-01-02',topics:['content']})];
  assert.deepEqual(ids(selectArticles(articles,{period:'30d',topic:'growth',q:'作者',sort:'newest'},new Date('2026-01-03T12:00:00Z'))),['new','old']);
  const neighbors=articleNeighbors(articles,{period:'30d',topic:'growth',q:'new'},'new',new Date('2026-01-03T12:00:00Z'));
  assert.equal(neighbors.total,1);assert.equal(neighbors.previous,null);assert.equal(neighbors.next,null);
  for(const value of ['30d','90d','365d'])assert.equal(validPeriod(value),true);
  for(const value of ['all','year-2025','year-2026','year-25','nonsense',null])assert.equal(validPeriod(value),false);
});
test('删除的年份条件回退时间不限，同时保留收藏、主题和文章地址',()=>{
  const state=readLibraryState('?period=year-2026&bookmarks=500&topic=growth&article=example');
  assert.equal(state.period,'all');assert.equal(state.bookmarks,'500');
  assert.equal(state.topic,'growth');assert.equal(state.article,'example');
  assert.ok(!libraryHref({...state,period:'year-2026'}).includes('period='));
});
test('搜索作者不区分大小写，隐藏条目和其他语言不进入阅读范围',()=>{
  const articles=[article('AndyL5cc'),article('another'),article('archived',{author:{name:'Andy',handle:'andy'},showcase:false}),article('english',{author:{name:'Andy',handle:'andy'},language:'en'})];
  assert.deepEqual(ids(selectArticles(articles,{q:'andy'})),['AndyL5cc']);
  assert.deepEqual(ids(publishedArticles(articles)),['AndyL5cc','another']);
});
test('中文文章扩充进入阅读范围，保留原有两篇与核验信息',async()=>{
  const articles=JSON.parse(await readFile(new URL('../data/articles.json',import.meta.url)));
  const visible=publishedArticles(articles),visibleIds=ids(visible);
  for(const id of ['ai-xiaomu-six-month-review','andyl5cc-ten-day-growth','xiaomanhedy-two-week-pitfalls','ai-jasonyu-coldstart-review'])assert.ok(visibleIds.includes(id),`${id} 未进入网站阅读范围`);
  assert.ok(visible.length>2);
  for(const a of visible){
    assert.equal(a.sourceType,'article',`${a.id} 不是文章`);
    assert.equal(a.evidence.status,'source-read');
    assert.equal(a.excerpt?.sourceUrl,a.sourceUrl);
    assert.match(a.tweetUrl,/^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/);
  }
});

test('普通帖不能通过全部、搜索或预览进入文章范围',()=>{
  const articles=[article('essay'),article('ordinary',{sourceType:'thread'}),article('unknown',{sourceType:null})];
  assert.deepEqual(ids(publishedArticles(articles)),['essay']);
  assert.deepEqual(ids(selectArticles(articles,{q:'ordinary'})),[]);
  assert.equal(articleNeighbors(articles,{},'ordinary').index,-1);
});

test('收藏量筛选包含边界，排除未采集值，并能组合时间、主题和预览',()=>{
  const now=new Date('2026-10-13T12:00:00Z');
  const recent=(id,fields)=>article(id,{publishedAt:'2026-10-01',...fields});
  const articles=[recent('below',{socialSnapshot:{bookmarks:499}}),recent('boundary',{socialSnapshot:{bookmarks:500}}),recent('more',{socialSnapshot:{bookmarks:1000}}),recent('unknown'),recent('zero',{socialSnapshot:{bookmarks:0}}),recent('old',{publishedAt:'2026-07-01',socialSnapshot:{bookmarks:2000}}),recent('other',{topics:['content'],socialSnapshot:{bookmarks:3000}})];
  assert.deepEqual(ids(selectArticles(articles,{bookmarks:'500',period:'30d',topic:'growth'},now)),['more','boundary']);
  assert.equal(selectArticles(articles,{bookmarks:'all'},now).length,7);
  const neighbors=articleNeighbors(articles,{bookmarks:'500',period:'30d',topic:'growth'},'more',now);
  assert.equal(neighbors.total,2);assert.equal(neighbors.next.id,'boundary');
  assert.equal(articleNeighbors(articles,{bookmarks:'500'},'below',now).index,-1);
});

test('收藏量条件与搜索、时间、排序和文章地址一起恢复，无效值回退',()=>{
  const state={q:'起号',topic:'content',period:'90d',bookmarks:'1000',sort:'newest',article:'example'};
  const href=libraryHref(state);
  assert.deepEqual(readLibraryState(new URL(href,'https://example.test').search),state);
  for(const value of ['-1','NaN','1000abc','',null])assert.equal(readLibraryState(`?bookmarks=${value}`).bookmarks,'all');
  assert.equal(libraryHref({bookmarks:'all',period:'all',topic:'all',sort:'popular'}),'./?sort=popular');
});

test('卡片搜索读取作者原文开头，不用隐藏导读冒充卡片内容',()=>{
  const articles=[article('original',{excerpt:{text:'没有什么黑科技'},summary:'隐藏导读关键词'}),article('other')];
  assert.deepEqual(ids(selectArticles(articles,{q:'黑科技'})),['original']);
  assert.deepEqual(ids(selectArticles(articles,{q:'隐藏导读关键词'})),[]);
});

test('预览卡片依照当前排序切换，到边界停止',()=>{
  const articles=[article('low',{socialSnapshot:{bookmarks:1}}),article('high',{socialSnapshot:{bookmarks:100}}),article('mid',{socialSnapshot:{bookmarks:50}})];
  const first=articleNeighbors(articles,{sort:'popular'},'high');
  assert.equal(first.index,0);assert.equal(first.total,3);assert.equal(first.previous,null);assert.equal(first.next.id,'mid');
  const middle=articleNeighbors(articles,{sort:'popular'},'mid');
  assert.equal(middle.previous.id,'high');assert.equal(middle.next.id,'low');
  assert.equal(articleNeighbors(articles,{sort:'popular'},'low').next,null);
});

test('预览切换只包含当前筛选结果，隐藏或未知条目没有相邻卡片',()=>{
  const articles=[article('one'),article('two',{topics:['monetization']}),article('hidden',{showcase:false})];
  const single=articleNeighbors(articles,{topic:'growth'},'one');
  assert.equal(single.total,1);assert.equal(single.previous,null);assert.equal(single.next,null);
  for(const id of ['two','hidden','missing']){
    const result=articleNeighbors(articles,{topic:'growth'},id);
    assert.equal(result.index,-1);assert.equal(result.previous,null);assert.equal(result.next,null);
  }
});
