import test from 'node:test';
import assert from 'node:assert/strict';
import {renderArticleNotes} from '../assets/article-notes.js';

test('文章统一说明立场，不显示逐篇核验记录',()=>{
  const html=renderArticleNotes({caveat:'收入为作者自述 <img src=x onerror=alert(1)>',checkedAt:'2026-10-19',socialSnapshot:{capturedAt:'2026-10-18T08:00:00Z'},readingRange:{text:'文字',images:'图片未审计',linkedMaterials:'外链未读'}});
  assert.ok(html.includes('本站收录第三方文章，观点与经验归原作者，不代表本站立场。'));
  assert.ok(!html.includes('阅读说明'));
  assert.ok(!html.includes('<img'));
  for(const hidden of ['收入为作者自述','2026-10-18','图片未审计','外链未读'])assert.ok(!html.includes(hidden));
});
