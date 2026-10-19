import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const articles=JSON.parse(readFileSync(new URL('../data/articles.json',import.meta.url),'utf8'));
const syntheses=JSON.parse(readFileSync(new URL('../data/synthesis.json',import.meta.url),'utf8'));

test('已审定偏离自媒体经营主线的来源不会重新进入文章或专题',()=>{
  // 人工阅读全文后的编辑决定，不用标题中的“涨粉”一词自动判定相关性。
  const excluded=new Map([
    ['aaron-video-post-followup','2095139268142174487'],
    ['kangaroo-x-drafts-workflow','2013861689717088342'],
    ['berry-information-source-workflow','2064551064402374821'],
    ['punk-visual-prompt-feedback','2058477219211829268']
  ]);
  for(const [id,postId] of excluded){
    assert.ok(!articles.some(a=>a.id===id||a.sourceUrl?.endsWith('/'+postId)),`${id} 不应因改名重新入库`);
    assert.ok(!syntheses.some(s=>s.points.some(p=>p.sourceIds.includes(id))),`${id} 不应留有专题引用`);
  }
});

test('保留商单变现和含 X 经验的跨平台复盘，暂缓其他平台专项',()=>{
  const brandDeal=articles.find(a=>a.id==='astronaut-low-follower-brand-deal');
  assert.equal(brandDeal?.showcase,true);
  assert.ok(brandDeal.topics.includes('monetization'));
  assert.equal(articles.find(a=>a.id==='wangzan-dual-platform-review')?.showcase,true);
  for(const postId of ['2063422060123320432','2106305264811196747']){
    assert.ok(!articles.some(a=>a.sourceUrl?.endsWith('/'+postId)),'小红书专项暂不进入正式库');
  }
});
