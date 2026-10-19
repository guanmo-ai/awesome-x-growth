import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateData, TOPICS, EXCERPT_MAX } from '../scripts/validate.mjs';
const articles = JSON.parse(await readFile(new URL('../data/articles.json',import.meta.url)));
const syntheses = JSON.parse(await readFile(new URL('../data/synthesis.json',import.meta.url)));

test('正式内容、出处与专题引用满足数据约定',()=>assert.deepEqual(validateData(articles,syntheses),[]));
test('X 来源、原帖入口与作者主页不能指向其他作者或其他文章',()=>{
  for(const change of [a=>a.tweetUrl='https://x.com/other/status/12345',a=>a.author.url='https://x.com/other',a=>a.author.handle='other']){
    const data=structuredClone(articles);change(data[0]);
    assert.ok(validateData(data,syntheses).some(e=>/须与.*一致/.test(e)));
  }
});
test('截图中的文章预览从作者第一段开始，保留原文顺序',()=>{
  const excerpt=articles.find(a=>a.id==='rwayne-growth-review-20261010').excerpt.text;
  assert.equal(excerpt,'声明：\n\n先说成绩，我从2025年11月1日开始正式在X做自媒体，到今天9月8日，10个月收获了5.83万的粉丝，累计5.58亿次曝光，超150万次点赞，单日最高2800万曝光');
  assert.ok([...excerpt].length<=EXCERPT_MAX);
});
test('一年收录上限排除过期、未来和不明发布日期',()=>{
  const asOf=new Date('2026-10-13T12:00:00Z');
  const fixture=[structuredClone(articles[0])];
  for(const publishedAt of ['2025-10-12','2026-10-14',null]){
    const changed=structuredClone(fixture);
    changed[0].publishedAt=publishedAt;
    assert.ok(validateData(changed,[],asOf).some(error=>error.includes('最近一年')),String(publishedAt));
  }
  const onBoundary=structuredClone(fixture);
  onBoundary[0].publishedAt='2025-10-13';
  assert.deepEqual(validateData(onBoundary,[],asOf),[]);
});
test('六个学习主题都有实际文章',()=>{
  for (const topic of Object.keys(TOPICS)) assert.ok(articles.some(a=>a.topics.includes(topic)),`缺少 ${topic}`);
});
test('全库归纳覆盖每篇正式文章',()=>{
  const referenced = new Set(syntheses.flatMap(s=>s.points.flatMap(p=>p.sourceIds)));
  for (const a of articles) assert.ok(referenced.has(a.id),`${a.id} 尚未纳入归纳`);
  const overview = new Set(syntheses.find(s=>s.id==='start-here').points.flatMap(p=>p.sourceIds));
  for (const a of articles) assert.ok(overview.has(a.id),`${a.id} 尚未纳入全库总览`);
});
test('重复来源和伪造结构的原帖链接会被拦截',()=>{
  const invalid = structuredClone(articles);
  invalid.push({...invalid[0],id:'duplicate-copy'});
  invalid[0].tweetUrl='https://x.com/just-a-profile';
  const errors=validateData(invalid,syntheses);
  assert.ok(errors.some(e=>e.includes('重复来源')));
  assert.ok(errors.some(e=>e.includes('原帖必须')));
});
test('原文专注入口不能跳到其他作者或文章',()=>{
  for (const url of ['https://x.com/other/article/2105845619915157543','https://x.com/ai_xiaomu/article/123']) {
    const invalid=structuredClone(articles);
    invalid.find(a=>a.id==='ai-xiaomu-six-month-review').readingUrl=url;
    assert.ok(validateData(invalid,syntheses).some(e=>e.includes('专注阅读地址')));
  }
});
test('缺失来源、错误引用、未读材料和私有路径不能进入正式库',()=>{
  const invalid=structuredClone(articles), digest=structuredClone(syntheses);
  invalid[0].evidence.status='search-only';
  invalid[0].sourceUrl='javascript:alert(1)';
  invalid[0].summary='/Users/private/research';
  digest[0].points[0].sourceIds=['does-not-exist'];
  digest[0].points[0].body='/Users/private/synthesis';
  const errors=validateData(invalid,digest);
  for (const message of ['来源必须','阅读证据','公开数据包含本地路径','公开专题包含本地路径','引用不存在']) assert.ok(errors.some(e=>e.includes(message)),message);
});
test('无效日期和冒充 X 原帖的官网条目不能通过',()=>{
  const invalid=structuredClone(articles);
  invalid[0].checkedAt='2026-02-30';
  invalid[0].sourceType='thread';
  invalid[0].tweetUrl=null;
  const errors=validateData(invalid,syntheses);
  assert.ok(errors.some(e=>e.includes('核验日期无效')));
  assert.ok(errors.some(e=>e.includes('缺少 tweetUrl')));
});
test('逐帖嵌入不能错序、重复或混入他人的帖子',()=>{
  const invalid=structuredClone(articles);
  const article=invalid.find(a=>a.tweetUrl);
  article.threadUrls=[article.tweetUrl,article.tweetUrl,'https://x.com/different_author/status/123'];
  let errors=validateData(invalid,syntheses);
  assert.ok(errors.some(e=>e.includes('重复原帖')));
  assert.ok(errors.some(e=>e.includes('同一作者')));
  article.threadUrls.reverse();
  errors=validateData(invalid,syntheses);
  assert.ok(errors.some(e=>e.includes('首条与原帖一致')));
});
test('全文必须有许可、作者授权依据和有效正文',()=>{
  const invalid=structuredClone(articles);
  const a=invalid.find(a=>a.rights.mode==='summary-link');
  a.fullText={language:'en',note:'原文',blocks:[{type:'paragraph',text:'Example text'}]};
  assert.ok(validateData(invalid,syntheses).some(e=>e.includes('导读模式不可夹带')));
  a.rights.mode='licensed-fulltext';
  assert.ok(validateData(invalid,syntheses).some(e=>e.includes('作者授权依据')));
  a.rights.license='CC BY-SA 3.0 US';
  a.rights.licenseUrl='https://creativecommons.org/licenses/by-sa/3.0/us/';
  a.rights.permissionUrl=a.sourceUrl;
  a.fullText.blocks[0].type='script';
  assert.ok(validateData(invalid,syntheses).some(e=>e.includes('全文块类型无效')));
});

test('无独立原文标题必须保留明确的编辑标题标记',()=>{
  const changed=structuredClone(articles);
  changed[0].originalTitle=null;
  delete changed[0].titleType;
  assert.ok(validateData(changed,syntheses).some(e=>e.includes('编辑标题')));
  changed[0].titleType='editorial';
  assert.deepEqual(validateData(changed,syntheses),[]);
});
test('面向中文涨粉的阅读路径只引用已读中文来源',()=>{
  const paths=syntheses.filter(s=>s.path);
  assert.ok(paths.length>0);
  for(const path of paths)for(const id of path.points.flatMap(p=>p.sourceIds)){
    const article=articles.find(a=>a.id===id);
    assert.equal(article?.language,'zh',`${path.id} 引用了非中文原作`);
    assert.equal(article?.evidence.status,'source-read');
  }
  for(const a of articles.filter(a=>a.learning)){
    assert.equal(a.language,'zh');
    assert.ok(a.learning.stage&&a.learning.lesson&&a.learning.action);
    for(const goal of a.learning.goals)assert.ok(paths.some(s=>s.goal===goal));
  }
});

test('新增原帖快照与媒体不能夹带伪数值、错误来源或非文库路径',()=>{
  const invalid=structuredClone(articles),a=invalid.find(a=>a.socialSnapshot&&a.presentation);
  a.socialSnapshot.bookmarks=-1;
  a.socialSnapshot.sourceUrl='https://x.com/unrelated/status/123';
  a.presentation.cover='./assets/../data/articles.json';
  const errors=validateData(invalid,syntheses);
  for(const text of ['非负安全整数','对应来源','有效路径'])assert.ok(errors.some(e=>e.includes(text)),text);
});

test('卡片原文开头不能缺少出处或扩大为长文，评论快照不能伪造',()=>{
  const invalid=structuredClone(articles),a=invalid.find(a=>a.excerpt);
  a.excerpt.text='文'.repeat(EXCERPT_MAX+1);
  a.excerpt.sourceUrl='https://x.com/unrelated/status/123';
  a.socialSnapshot.replies=-1;
  const errors=validateData(invalid,syntheses);
  for(const text of [`${EXCERPT_MAX} 字符`,'开头须有对应来源','评论快照数量'])assert.ok(errors.some(e=>e.includes(text)),text);
});
test('开头排版不能夹带改写的段落、无效强调范围或回退中段节选',()=>{
  for(const mutate of [a=>{a.excerpt.kind='selection';},a=>{a.excerpt.blocks[0].text='不同的正文';},a=>{a.excerpt.blocks[0].styles=[{style:'Bold',offset:0,length:1000}];}]){
    const invalid=structuredClone(articles),a=invalid.find(a=>a.excerpt);
    mutate(a);
    assert.ok(validateData(invalid,syntheses).some(e=>/开头/.test(e)));
  }
});

test('AI 总结不能混用其他原文、空要点或超长正文',()=>{
  const invalid=structuredClone(articles),a=invalid.find(a=>a.aiSummary);
  a.aiSummary.sourceUrl='https://x.com/unrelated/status/123';
  a.aiSummary.checkedAt='2026-02-30';
  a.aiSummary.points[0].text='';
  let errors=validateData(invalid,syntheses);
  assert.ok(errors.some(e=>e.includes('总结须有对应原文')));
  assert.ok(errors.some(e=>e.includes('完整要点')));
  a.aiSummary.points[0].text='文'.repeat(601);
  errors=validateData(invalid,syntheses);
  assert.ok(errors.some(e=>e.includes('600 字符')));
});

test('新增展示文章不能退化为没有展示方案和内容的卡片',()=>{
  const invalid=structuredClone(articles),a=invalid.find(a=>a.showcase);
  delete a.presentation;
  delete a.excerpt;
  a.aiSummary.points=a.aiSummary.points.slice(0,1);
  const errors=validateData(invalid,syntheses);
  assert.ok(errors.some(e=>e.includes('展示方案')));
  assert.ok(errors.some(e=>e.includes('至少三个阅读要点')));
});

test('普通帖退出正式库，本站文字卡片不能改变来源文章类型',()=>{
  const changed=structuredClone(articles),a=changed.find(a=>a.showcase);
  a.sourceType='thread';a.originalTitle=null;a.titleType='editorial';delete a.readingUrl;
  a.presentation.coverKind='text-post';
  for(const key of ['cover','coverWidth','coverHeight','coverOriginalUrl'])delete a.presentation[key];
  assert.ok(validateData(changed,syntheses).some(e=>e.includes('只允许文章')));
  a.sourceType='article';
  assert.ok(validateData(changed,syntheses).some(e=>e.includes('文字卡片只允许')));
  a.sourceType='thread';a.presentation.cover='./assets/articles/misleading-cover.jpg';
  assert.ok(validateData(changed,syntheses).some(e=>e.includes('文字卡片只允许')));
});
