// 本站阅读导航；文章标题、作者与总结仍来自 articles.json。
export const GUIDES = [
  {id:'start',label:'开始起号',title:'先让读者知道，为什么要关注你',action:'本站建议：用一句话写清“我为谁，持续分享什么”，再检查简介与最近三篇内容是否一致。',picks:[
    {id:'cnyzgkc-one-year-pitfalls',reason:'先检查主页：身份、简介与作品怎样配合。'},
    {id:'zhouluobo-growth-review-20261010',reason:'再看定位：用具体作品给读者一个关注理由。'}]},
  {id:'write',label:'持续发内容',title:'把经历和读者问题，变成持续的选题',action:'本站建议：从近期做过的事或读者追问中选一个问题，写清过程、结果和适用条件。',picks:[
    {id:'weichen-content-idea-system',reason:'找选题：从熟悉领域、兴趣与经历建立素材库。'},
    {id:'minli-x-writing-process',reason:'把稿子写清楚：先确定谁能受益，再检查开头和例子。'}]},
  {id:'review',label:'互动与复盘',title:'分清有人看见，和有人愿意继续关注',action:'本站建议：回看近期内容，分别记录曝光、主页访问与新增关注；同时保留表现好的和表现差的样本。',picks:[
    {id:'xiaomanhedy-two-week-pitfalls',reason:'先看低效样本：多发、追热点为什么未必带来关注。'},
    {id:'han-zhang-x-post-sample-analysis',reason:'再学比较方法：与自己的基线比，读懂样本边界。'}]}
];
export function guideArticles(guide,articles){
  return guide.picks.flatMap(p=>{const article=articles.find(a=>a.id===p.id);return article?[{...p,article}]:[];});
}
export function validateGuides(articles){
  const errors=[];
  for(const g of GUIDES)for(const p of g.picks){
    const a=articles.find(a=>a.id===p.id);
    if(!a?.showcase||a.sourceType!=='article'||a.language!=='zh')errors.push(`${g.id}: 阅读导航引用未展示的文章 ${p.id}`);
  }
  return errors;
}
