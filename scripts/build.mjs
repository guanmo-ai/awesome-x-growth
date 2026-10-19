import { readFile, writeFile, mkdir, cp, access, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { validateData, TOPICS } from './validate.mjs';
import { validateTools } from './validate-tools.mjs';
import {validateGuides} from '../assets/guides.js';
import {publishedArticles} from '../assets/library.js';
import {PUBLIC_ASSETS,PUBLIC_DOCS,siteBase,addSocialMetadata,articlePage,publicArticle} from './publication.mjs';
import {articleMediaFiles} from './media.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFile(resolve(root, name), 'utf8');
const articles = JSON.parse(await read('data/articles.json'));
const syntheses = JSON.parse(await read('data/synthesis.json'));
const tools = JSON.parse(await read('data/tools.json'));
const preview=process.argv.includes('--preview');
if (preview && process.env.SITE_URL) { console.error('本地原图审阅不能配置 SITE_URL；公开构建请使用 npm run build。'); process.exit(1); }
const base=siteBase(process.env.SITE_URL||'');
const errors = [...validateData(articles, syntheses), ...validateTools(tools),...validateGuides(articles)];
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
const visible=publishedArticles(articles),mediaFiles=articleMediaFiles(visible,{preview});
for (const path of mediaFiles) {
  try { await access(resolve(root,path)); }
  catch { errors.push(`缺少实际图片文件 ${path}；请恢复文章原图，不以无图页面替代。`); }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
const md = s => String(s).replace(/[\r\n|]/g, ' ').replace(/\[/g, '\\[').replace(/\]/g, '\\]');
const catalog = `# 文章目录\n\n此文件由 \`npm run build\` 从 \`data/articles.json\` 生成。共 ${articles.length} 篇最近一年内的资料、${new Set(articles.map(a => a.author.handle)).size} 位作者/机构。文章链接直接打开原始来源；当前网站展示范围以 showcase 为准。\n\n` + Object.entries(TOPICS).map(([id, label]) => `## ${label}\n\n| 文章 | 作者 | 类型 | 原文 | 核验日 |\n| --- | --- | --- | --- | --- |\n` + articles.filter(a => a.topics.includes(id)).map(a => `| [${md(a.title)}](${a.readingUrl||a.sourceUrl}) | [${md(a.author.name)}](${a.author.url}) | ${{thread:'X 原帖',article:'作者文章',official:'官方资料'}[a.sourceType]} | [来源](${a.sourceUrl}) | ${a.checkedAt} |`).join('\n')).join('\n\n') + '\n';
const digest = `# AI 全库归纳\n\n归纳范围：当前 ${articles.length} 篇已收录资料。AI 辅助编辑，观点可以回到具体来源；不保证涨粉或收益。\n\n` + syntheses.map(s => `## ${s.title}\n\n${s.question}\n\n${s.intro}\n\n` + s.points.map(p => `### ${p.title}\n\n${p.body}\n\n来源：${p.sourceIds.map(id => { const a = articles.find(a => a.id === id); return `[${md(a.author.name)} · ${md(a.title)}](${a.sourceUrl})`; }).join('；')}\n`).join('\n') + `\n适用边界：${s.limitation}\n`).join('\n');
const toolCatalog = '# 插件与工具目录\n\n由 `data/tools.json` 生成。工具页是次级入口，默认首页仍为文章。以下是研究候选；官网核验、源码阅读与接口实测不等于安装试用通过。\n\n' + tools.map(t=>`## ${t.name}\n\n${t.tagline}\n\n> ${t.preview.official.text}\n\n[官方介绍节选](${t.preview.official.url})\n\nAI 总结：\n${t.preview.summary.map(s=>`- ${s}`).join('\n')}\n\n${t.chromeWebStore?`- [Chrome 用户数](${t.chromeWebStore.url})：${t.chromeWebStore.users.toLocaleString('en-US')}（采集于 ${t.chromeWebStore.capturedAt}）\n`:''}${t.github?`- [GitHub Stars](${t.github.url})：${t.github.stars.toLocaleString('en-US')}（采集于 ${t.github.capturedAt}）\n`:''}- 用途：${t.use}\n- 值得学：${t.learn}\n- 成本：${t.cost}\n- 使用条件：${t.access}\n- 边界：${t.limitation}\n- 核验（${t.checkedAt}）：${t.evidence}\n- [入口](${t.url})${t.repository?` · [源码](${t.repository}) · ${t.license}`:''}\n- 来源：${t.sources.map(s=>`[${md(s.label)}](${s.url})`).join(' · ')}\n`).join('\n');
const outputs = new Map([['docs/CATALOG.md',catalog],['docs/AI_DIGEST.md',digest],['docs/TOOLS.md',toolCatalog]]);
if (process.argv.includes('--check')) {
  for (const [path, content] of outputs) {
    let current = ''; try { current = await read(path); } catch {}
    if (current !== content) { console.error(`${path} 需要重新生成：npm run build`); process.exitCode = 1; }
  }
  for (const path of ['index.html','tools.html',...PUBLIC_ASSETS.map(x=>'assets/'+x),...PUBLIC_DOCS.map(x=>'docs/'+x)]) { try { await access(resolve(root,path)); } catch { console.error(`缺少站点文件：${path}`); process.exitCode = 1; } }
  if (!process.exitCode) console.log(`检查通过：${articles.length} 篇资料，${syntheses.length} 个专题，引用与生成目录一致。`);
} else {
  for (const [path,content] of outputs) await writeFile(resolve(root,path),content);
  const out = resolve(root,preview?'.local/preview':'dist');
  await rm(out,{recursive:true,force:true});
  await mkdir(out,{recursive:true});
  for(const [page,title,description] of [
    ['index.html','Awesome X Growth · 推特运营与涨粉','从起号定位、内容创作到互动与复盘，找到有出处的创作者经验。'],
    ['tools.html','推特运营工具 · Awesome X Growth','查找选题、写作、收藏与复盘工具，了解费用、使用条件和核验边界。']
  ])await writeFile(resolve(out,page),addSocialMetadata(await read(page),{title,description,path:page==='index.html'?'':page,base}));
  for(const name of PUBLIC_ASSETS){
    const dest=resolve(out,'assets',name);await mkdir(dirname(dest),{recursive:true});await cp(resolve(root,'assets',name),dest);
  }
  for(const name of PUBLIC_DOCS){await mkdir(resolve(out,'docs'),{recursive:true});await cp(resolve(root,'docs',name),resolve(out,'docs',name));}
  for(const name of ['LICENSE','CONTENT_POLICY.md'])await cp(resolve(root,name),resolve(out,name));
  await mkdir(resolve(out,'data'),{recursive:true});
  await writeFile(resolve(out,'data/articles.json'),JSON.stringify(visible.map(a=>publicArticle(a,{preview})))+'\n');
  await writeFile(resolve(out,'data/tools.json'),JSON.stringify(tools)+'\n');
  await mkdir(resolve(out,'articles'),{recursive:true});
  for(const a of visible)await writeFile(resolve(out,'articles',a.id+'.html'),articlePage(a,base));
  for(const path of mediaFiles){
    await mkdir(dirname(resolve(out,path)),{recursive:true});await cp(resolve(root,path),resolve(out,path));
  }
  if(base){
    const urls=['','tools.html',...visible.map(a=>`articles/${a.id}.html`)];
    await writeFile(resolve(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path=>`<url><loc>${new URL(path,base).href.replaceAll('&','&amp;')}</loc></url>`).join('')}</urlset>`);
    await writeFile(resolve(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml',base).href}\n`);
  }
  await writeFile(resolve(out,'release.json'),JSON.stringify({mode:preview?'local-preview':'public',siteUrl:base||null,articles:visible.length,tools:tools.length,articleMediaFiles:mediaFiles,publicAssets:PUBLIC_ASSETS,publicDocs:PUBLIC_DOCS},null,2)+'\n');
  console.log(`构建完成：${visible.length} 篇文章、${tools.length} 个工具及独立阅读页。${preview?'原图审阅位于 .local/preview/，仅供本机使用，不可发布。':'公开候选位于 dist/；尚未部署。'}${base?' 已配置正式分享地址。':preview?'':' 未配置 SITE_URL，正式域名与平台分享预览待上线验收。'}`);
}
