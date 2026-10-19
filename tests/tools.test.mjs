import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {selectTools,toolNeighbors,readToolState,toolHref} from '../assets/tools-library.js';
import {validateTools} from '../scripts/validate-tools.mjs';
const tools=JSON.parse(await readFile(new URL('../data/tools.json',import.meta.url),'utf8'));
test('排序分别使用 Chrome 用户数和 Stars，未知值在零之后，同值保持稳定',()=>{
  const sample=[{id:'unknown',pick:false},{id:'zero',chromeWebStore:{users:0},github:{stars:0}}, {id:'a',chromeWebStore:{users:20},github:{stars:2}},{id:'b',pick:true,chromeWebStore:{users:10},github:{stars:30}},{id:'tie',chromeWebStore:{users:20},github:{stars:2}}];
  const ids=sort=>selectTools(sample,{sort}).map(t=>t.id);
  assert.deepEqual(ids('users'),['a','tie','b','zero','unknown']);
  assert.deepEqual(ids('stars'),['b','a','tie','zero','unknown']);
  assert.deepEqual(ids('recommended'),['b','unknown','zero','a','tie']);
  assert.equal(sample[0].id,'unknown');
});
test('排序、筛选与弹窗地址可恢复，无效条件回退默认值',()=>{
  const state={q:'收藏 & 搜索',purpose:'save',openSource:true,sort:'stars',tool:'bookmark-x'};
  assert.deepEqual(readToolState(toolHref(state).split('?')[1]),state);
  assert.equal(readToolState('?sort=invalid&purpose=toString').sort,'recommended');
  assert.equal(readToolState('?purpose=toString').purpose,'all');
});
test('弹窗前后切换遵循排序与筛选，边界和不存在的工具不可越界',()=>{
  const state={openSource:true,sort:'stars'},found=selectTools(tools,state);
  const first=toolNeighbors(tools,state,found[0].id),last=toolNeighbors(tools,state,found.at(-1).id);
  assert.equal(first.previous,null);assert.equal(first.next.id,found[1].id);
  assert.equal(last.next,null);assert.equal(toolNeighbors(tools,state,'typefully').next,null);
});
test('弹窗区分官方节选与 AI 总结，缺失来源和过长摘录会被拦截',()=>{
  const bad=structuredClone(tools);bad[0].preview.official.url='https://example.com';bad[1].preview.summarySources=[];bad[2].preview.official.text='word '.repeat(26);
  const errors=validateTools(bad).join('\n');assert.match(errors,/官方节选或出处/);assert.match(errors,/AI 总结缺少/);assert.match(errors,/节选过长/);
});
test('用户数与 Stars 保留数字口径、来源和采集时间，未知值允许留空',()=>{
  const bad=structuredClone(tools);
  bad[0].chromeWebStore.users='30,000';
  bad[1].github.url='https://github.com/wrong/project';
  bad[2].github.capturedAt=null;
  const errors=validateTools(bad).join('\n');
  assert.match(errors,/非负整数/);assert.match(errors,/数据来源/);assert.match(errors,/采集时间/);
  const unknown=structuredClone(tools);unknown[0].chromeWebStore=null;
  assert.deepEqual(validateTools(unknown),[]);
});
test('工具必须保留用途、成本、核验层级、来源和固定源码版本',()=>{
  assert.deepEqual(validateTools(tools),[]);
  const bad=structuredClone(tools);bad[0].sources=[];bad[1].revision=null;bad[2].url='javascript:alert(1)';bad[3].id=bad[0].id;
  const errors=validateTools(bad).join('\n');
  assert.match(errors,/来源/);assert.match(errors,/固定版本/);assert.match(errors,/HTTPS/);assert.match(errors,/重复/);
});
test('用途、关键词和开源条件共同生效，找不到时不回退为全部',()=>{
  const result=selectTools(tools,{purpose:'discover',q:'素材',openSource:true});
  assert.ok(result.length>0);assert.ok(result.every(t=>t.repository&&t.purposes.includes('discover')));
  assert.equal(selectTools(tools,{q:'tYpEfUlLy'}).length,1);
  assert.equal(selectTools(tools,{q:'Typefully',openSource:true}).length,0);
  assert.equal(selectTools(tools,{q:'不存在的测试工具'}).length,0);
});
