import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {PUBLIC_ASSETS,PUBLIC_DOCS,publicArticle,siteBase} from './publication.mjs';
import {publishedArticles} from '../assets/library.js';
import {articleMediaFiles} from './media.mjs';
import {validateData} from './validate.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),out=resolve(root,'dist');
const read=path=>readFile(resolve(out,path),'utf8');
const release=JSON.parse(await read('release.json'));
assert.equal(release.mode,'public','本地原图审阅产物不可作为公开发行包');
const sourceArticles=JSON.parse(await readFile(resolve(root,'data/articles.json'),'utf8'));
assert.deepEqual(validateData(sourceArticles,JSON.parse(await readFile(resolve(root,'data/synthesis.json'),'utf8'))),[],'发行前须通过数据与图片来源字段校验（不判断授权真实性）');
const articles=publishedArticles(sourceArticles);
const tools=JSON.parse(await readFile(resolve(root,'data/tools.json'),'utf8'));
assert.deepEqual(JSON.parse(await read('data/articles.json')),articles.map(a=>publicArticle(a)),'发行数据应与已验证的公开文章一致');
assert.deepEqual(JSON.parse(await read('data/tools.json')),tools);
const approved=articleMediaFiles(articles);
assert.deepEqual(release.articleMediaFiles,approved,'媒体清单须与当前展示文章一致');
const expected=new Set(['index.html','tools.html','LICENSE','CONTENT_POLICY.md','release.json','data/articles.json','data/tools.json',...PUBLIC_ASSETS.map(x=>'assets/'+x),...PUBLIC_DOCS.map(x=>'docs/'+x),...articles.map(a=>`articles/${a.id}.html`),...approved,...(release.siteUrl?['robots.txt','sitemap.xml']:[])]);
async function walk(dir=''){
  const files=[];
  for(const entry of await readdir(resolve(out,dir),{withFileTypes:true})){
    assert.ok(!entry.isSymbolicLink(),'发行包不可包含符号链接');
    const path=dir?`${dir}/${entry.name}`:entry.name;
    files.push(...(entry.isDirectory()?await walk(path):[path]));
  }
  return files;
}
const files=await walk();
assert.deepEqual([...files].sort(),[...expected].sort(),'发行包只能包含白名单文件');
let localLinks=0,bytes=0;
for(const path of files){
  bytes+=(await stat(resolve(out,path))).size;
  if(!/\.(html|css|js|json|md|txt|xml)$/.test(path))continue;
  const text=await read(path);
  assert.ok(!/\/Users\/|\.research\/|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----/.test(text),`${path} 含私人路径或研究文件引用`);
  const refs=[];
  if(path.endsWith('.html')){
    refs.push(...[...text.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]));
    assert.match(text,/name="description"/);assert.match(text,/property="og:title"/);
    if(path.startsWith('articles/'))assert.ok(!/<script\b/.test(text),'独立阅读页应不依赖脚本');
    if(release.siteUrl)assert.ok(text.includes(`rel="canonical" href="${new URL(path==='index.html'?'':path,release.siteUrl).href}"`));
  }
  if(path.endsWith('.css'))refs.push(...[...text.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(m=>m[1]));
  if(path.endsWith('.js'))refs.push(...[...text.matchAll(/\bfrom\s*['"]([^'"]+)['"]/g)].map(m=>m[1]));
  if(path.endsWith('.md'))refs.push(...[...text.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]));
  for(const ref of refs){
    if(/^(?:https?:|mailto:|data:|#)/.test(ref))continue;
    const clean=ref.split(/[?#]/)[0]||'./';
    const target=resolve(out,dirname(path),clean),rel=relative(out,target);
    assert.ok(!rel.startsWith('..'),`${path}: 本地链接越界 ${ref}`);
    const file=clean.endsWith('/')?`${rel}/index.html`.replace(/^\//,''):rel;
    assert.ok(expected.has(file),`${path}: 缺少本地链接目标 ${ref}`);localLinks++;
  }
}
const png=await readFile(resolve(out,'assets/share-card.png'));
assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
assert.equal(release.articles,articles.length);assert.equal(release.tools,tools.length);
if(release.siteUrl){
  assert.equal(siteBase(release.siteUrl),release.siteUrl);
  const sitemap=await read('sitemap.xml');
  for(const path of ['', 'tools.html',...articles.map(a=>`articles/${a.id}.html`)])assert.ok(sitemap.includes(new URL(path,release.siteUrl).href));
  assert.ok((await read('robots.txt')).includes(new URL('sitemap.xml',release.siteUrl).href));
}
console.log(`发行检查通过：${files.length} 个文件，${articles.length} 篇独立文章，${localLinks} 处本地引用，${(bytes/1024/1024).toFixed(2)} MiB。${release.siteUrl?'已验证配置地址与子目录路径；不代表线上抓取成功。':'未配置正式域名，分享抓取需上线后验收。'}`);
