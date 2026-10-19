import test from 'node:test';
import assert from 'node:assert/strict';
import {renderArticleNotes} from '../assets/article-notes.js';

test('阅读说明保留作者自述边界和快照日期，转义不可信文字',()=>{
  const html=renderArticleNotes({caveat:'收入为作者自述 <img src=x onerror=alert(1)>',checkedAt:'2026-10-19',socialSnapshot:{capturedAt:'2026-10-18T08:00:00Z'},readingRange:{text:'文字',images:'图片未审计',linkedMaterials:'外链未读'}});
  assert.match(html,/<details class="article-notes"><summary>阅读说明<\/summary>/);
  assert.ok(html.includes('收入为作者自述 &lt;img'));
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('2026-10-18（UTC，非实时）'));
  assert.ok(html.includes('图片未审计'));assert.ok(html.includes('外链未读'));
});
