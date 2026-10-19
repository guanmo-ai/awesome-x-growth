import {PURPOSES,LEVELS} from '../assets/tools-library.js';
const https=value=>{try{return new URL(value).protocol==='https:';}catch{return false;}};
export function validateTools(tools) {
  if(!Array.isArray(tools)||!tools.length)return ['工具目录必须是非空数组'];
  const errors=[],ids=new Set();
  for(const t of tools){
    if(!t||typeof t!=='object'){errors.push('工具记录必须是对象');continue;}
    const id=t.id||'未知工具';
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)||ids.has(id))errors.push(`${id}: ID 无效或重复`);
    ids.add(id);
    for(const k of ['name','kind','tagline','use','learn','cost','access','limitation','evidence'])if(typeof t[k]!=='string'||!t[k].trim())errors.push(`${id}: 缺少 ${k}`);
    if(!Object.hasOwn(LEVELS,t.level)||typeof t.pick!=='boolean')errors.push(`${id}: 核验级别或优先级无效`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(t.checkedAt)||!Number.isFinite(Date.parse(t.checkedAt)))errors.push(`${id}: 缺少核验日期`);
    if(!Array.isArray(t.purposes)||!t.purposes.length||t.purposes.some(p=>!Object.hasOwn(PURPOSES,p)))errors.push(`${id}: 用途无效`);
    if(!https(t.url))errors.push(`${id}: 入口必须为 HTTPS`);
    const p=t.preview,knownSources=new Set([t.url,t.repository,...(Array.isArray(t.sources)?t.sources.map(s=>s.url):[])]);
    if(!p?.official?.text?.trim()||!p.official.label||!https(p.official.url)||!knownSources.has(p.official.url))errors.push(`${id}: 缺少官方节选或出处`);
    if(p?.official?.text?.trim().split(/\s+/).length>25)errors.push(`${id}: 官方节选过长`);
    if(!Array.isArray(p?.summary)||p.summary.length<1||p.summary.length>3||p.summary.some(s=>typeof s!=='string'||!s.trim()||s.length>160))errors.push(`${id}: AI 总结必须简短且非空`);
    if(!Array.isArray(p?.summarySources)||!p.summarySources.length||p.summarySources.some(s=>!https(s)||!knownSources.has(s)))errors.push(`${id}: AI 总结缺少已登记来源`);
    if(!p?.pricing?.trim()||!p?.setup?.trim())errors.push(`${id}: 缺少费用或使用方式`);
    for(const [key,count] of [['chromeWebStore','users'],['github','stars']]){
      const s=t[key];
      if(s==null)continue;
      if(!Number.isSafeInteger(s[count])||s[count]<0)errors.push(`${id}: ${key} 数量必须为非负整数`);
      if(typeof s.capturedAt!=='string'||!Number.isFinite(Date.parse(s.capturedAt)))errors.push(`${id}: ${key} 缺少采集时间`);
      if(!https(s.url)||(key==='github'?s.url!==t.repository:!/^https:\/\/chromewebstore\.google\.com\/detail\/[^/?]+\/[a-p]{32}(?:\?|$)/.test(s.url)))errors.push(`${id}: ${key} 数据来源无效`);
    }
    if(t.logo&&(!/^\.\/assets\/tools\/[a-z0-9-]+\.(png|jpg|svg)$/.test(t.logo.path)||!https(t.logo.source)))errors.push(`${id}: 图标路径或来源无效`);
    if(t.repository&&(!https(t.repository)||!t.license||! /^[a-f0-9]{40}$/.test(t.revision||'')))errors.push(`${id}: 开源项目缺少仓库、许可证或固定版本`);
    if(!Array.isArray(t.sources)||!t.sources.length||t.sources.some(s=>!s?.label||!https(s.url)))errors.push(`${id}: 缺少可追溯来源`);
    if(/\/Users\/|\.research\/|Bearer\s+[\w-]+/.test(JSON.stringify(t)))errors.push(`${id}: 公开数据包含私有内容`);
  }
  return errors;
}
