import test from 'node:test';
import assert from 'node:assert/strict';
import {renderAuthorOpening} from '../assets/opening.js';
import {extractAuthorOpening} from '../scripts/author-opening.mjs';

test('作者开头保留标题、引用、列表与重叠的强调，原文不能注入 HTML',()=>{
  const html=renderAuthorOpening({blocks:[
    {type:'header-two',text:'开头标题'},
    {type:'blockquote',text:'<内容>&',styles:[{offset:0,length:4,style:'Bold'},{offset:1,length:2,style:'Italic'}]},
    {type:'ordered-list-item',text:'第一项'},
    {type:'ordered-list-item',text:'第二项'},
    {type:'unstyled',text:'下一段\n原有换行'}
  ]});
  assert.ok(html.includes('<h3>开头标题</h3>'));
  assert.ok(html.includes('<blockquote>'));
  assert.ok(html.includes('<em><strong>内容</strong></em>'));
  assert.ok(html.includes('&lt;')&&html.includes('&gt;')&&html.includes('&amp;'));
  assert.ok(html.includes('<ol><li>第一项</li><li>第二项</li></ol>'));
  assert.ok(html.includes('下一段\n原有换行'));
  assert.ok(!html.includes('<内容>'));
});

test('约100字的作者开头在完整句子处结束，并保留后文省略标记',()=>{
  const first='甲'.repeat(69)+'。',second='乙'.repeat(34)+'。',later='后文继续。';
  const opening=extractAuthorOpening([{type:'unstyled',text:first+second+later}]);
  assert.equal(opening.text,first+second);
  assert.equal(opening.truncated,true);
  const html=renderAuthorOpening(opening);
  assert.ok(html.endsWith('。<span class="opening-ellipsis" aria-label="后文省略">……</span></p>'));
  assert.equal((html.match(/opening-ellipsis/g)||[]).length,1);
});

test('收句包含原文右引号，格式范围不越过截取位置，原文前缀不被改写',()=>{
  const text='甲'.repeat(93)+'？”接着继续说明下一句话。';
  const opening=extractAuthorOpening([{type:'unstyled',text,inlineStyleRanges:[{offset:0,length:text.length,style:'Bold'}]}]);
  assert.equal(opening.text,'甲'.repeat(93)+'？”');
  assert.deepEqual(opening.blocks[0].styles,[{offset:0,length:95,style:'Bold'}]);
});

test('作者用换行续写一句时不在逗号处截断，过长首句须核对',()=>{
  const first='甲'.repeat(99)+'，',second='这句话在这里才结束。';
  const opening=extractAuthorOpening([{type:'unstyled',text:first},{type:'unstyled',text:second},{type:'unstyled',text:'后面的新段落。'}]);
  assert.equal(opening.text,first+'\n\n'+second);
  assert.throws(()=>extractAuthorOpening([{type:'unstyled',text:'甲'.repeat(230)+'。'}]),/不能截断句子/);
});

test('完整短正文不添加省略号，列表中的省略号只出现在最后一项',()=>{
  const full=extractAuthorOpening([{type:'unstyled',text:'全文只有这一句话。'}]);
  assert.equal(full.truncated,false);
  assert.ok(!renderAuthorOpening(full).includes('opening-ellipsis'));
  const html=renderAuthorOpening({truncated:true,blocks:[{type:'ordered-list-item',text:'第一项。'},{type:'ordered-list-item',text:'第二项。'}]});
  assert.ok(html.endsWith('第二项。<span class="opening-ellipsis" aria-label="后文省略">……</span></li></ol>'));
  assert.equal(renderAuthorOpening({truncated:true,blocks:[{type:'unstyled',text:'作者本来就写了……'}]}),'<p>作者本来就写了……</p>');
});

test('不在没有句末标点的短小节标题后结束',()=>{
  const first='甲'.repeat(82)+'。';
  const opening=extractAuthorOpening([{type:'unstyled',text:first},{type:'unstyled',text:'先说清楚'},{type:'unstyled',text:'乙'.repeat(100)+'。'}]);
  assert.equal(opening.text,first);
});
