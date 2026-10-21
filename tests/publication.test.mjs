import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {siteBase,socialMetadata,articlePage,publicArticle} from '../scripts/publication.mjs';
import {validateData} from '../scripts/validate.mjs';
import {GUIDES,validateGuides,guideArticles} from '../assets/guides.js';
const articles=JSON.parse(await readFile(new URL('../data/articles.json',import.meta.url))),syntheses=JSON.parse(await readFile(new URL('../data/synthesis.json',import.meta.url)));
test('正式分享地址支持子目录，拒绝凭据和非 HTTPS 地址',()=>{
  const base=siteBase('https://example.test/growth');
  assert.equal(base,'https://example.test/growth/');
  const meta=socialMetadata({title:'A & B <test>',description:'"方法"',path:'articles/example.html',base});
  assert.match(meta,/https:\/\/example.test\/growth\/articles\/example.html/);
  assert.match(meta,/https:\/\/example.test\/growth\/assets\/share-card.png/);
  assert.ok(meta.includes('A &amp; B &lt;test&gt;'));assert.ok(meta.includes('&quot;方法&quot;'));
  for(const url of ['http://example.test/','https://user:secret@example.test/','https://example.test/?token=secret','https://example.test/#private'])assert.throws(()=>siteBase(url));
});
test('独立文章页无需 JavaScript，保留来源和摘要边界且不泄漏研究字段',()=>{
  const a=articles.find(a=>a.showcase),html=articlePage(a,'https://example.test/');
  assert.ok(html.includes(a.sourceUrl));assert.ok(html.includes('作者原文开头'));assert.ok(html.includes('AI 总结'));assert.ok(!html.includes('适用边界'));assert.ok(!html.includes('来源与核验范围'));
  assert.ok(html.includes('不代表本站立场'));assert.ok(!html.includes('阅读说明'));assert.ok(!html.includes(a.caveat));
  assert.ok(!html.includes('<script'));assert.ok(html.includes('../'+a.presentation.cover.slice(2)));assert.ok(html.includes('class="viewer-cover"'));
  const payload=publicArticle({...a,sections:[{body:'隐藏旧笔记'}],summary:'旧导读'});
  assert.equal(payload.sections,undefined);assert.equal(payload.summary,undefined);assert.deepEqual(payload.excerpt,a.excerpt);
  for(const key of ['caveat','readingRange','evidence','policyReview'])assert.equal(payload[key],undefined);
});
test('展示文章必须有原图，并保留来源署名与尺寸',()=>{
  const changed=structuredClone(articles),a=changed.find(a=>a.showcase);
  a.presentation={coverKind:'editorial',deck:a.presentation.deck,provenance:'测试',cover:'./assets/articles/unapproved.jpg'};
  assert.ok(validateData(changed,syntheses).some(x=>x.includes('不可夹带图片')));
  Object.assign(a.presentation,{coverKind:'article-cover',avatar:'./assets/articles/author.jpg',mediaCredit:a.author.name,mediaSource:a.sourceUrl,coverWidth:1200,coverHeight:480});
  assert.deepEqual(validateData(changed,syntheses),[]);
  delete a.presentation.cover;
  assert.ok(validateData(changed,syntheses).some(x=>x.includes('展示文章必须保留原图')));
});
test('阅读导航引用真实展示文章，隐藏或删除来源会阻止构建',()=>{
  assert.deepEqual(validateGuides(articles),[]);
  const id=GUIDES[0].picks[0].id;
  assert.ok(validateGuides(articles.filter(a=>a.id!==id)).some(x=>x.includes(id)));
  assert.ok(validateGuides(articles.map(a=>a.id===id?{...a,showcase:false}:a)).length);
  assert.equal(guideArticles(GUIDES[0],articles).length,2);
});
