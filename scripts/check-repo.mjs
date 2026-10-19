import {execFileSync} from 'node:child_process';
import {readFile,lstat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {articleMediaFiles} from './media.mjs';
import {publishedArticles} from '../assets/library.js';

export function repositoryPathErrors(files,articles) {
  const approved=new Set(articleMediaFiles(articles)),errors=[];
  for(const file of files) {
    if (/^(?:\.research|\.local|dist|node_modules|\.agents|data\/research)\//.test(file) || /(?:^|\/)\.env(?:\.|$)/.test(file) && !file.endsWith('.env.example') || /\.(?:pem|key|p12|pfx)$/i.test(file)) errors.push(`${file}: 不可公开本地材料或凭据文件`);
    if(file.startsWith('assets/articles/') && !approved.has(file)) errors.push(`${file}: 图片未被文章数据引用`);
  }
  const candidates=new Set(files);
  for(const file of articleMediaFiles(publishedArticles(articles))) {
    if(!candidates.has(file))errors.push(`${file}: 展示文章使用的图片尚未纳入 Git 候选，干净克隆将缺图`);
  }
  return errors;
}
export function hasCredential(text) {
  return /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{40,}\b|\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b|\bAKIA[A-Z0-9]{16}\b/.test(text);
}
export async function checkRepository(root) {
  const files=[...new Set(execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean))];
  const articles=JSON.parse(await readFile(resolve(root,'data/articles.json'),'utf8'));
  const errors=repositoryPathErrors(files,articles);
  for(const file of files) {
    const path=resolve(root,file);
    if((await lstat(path)).isSymbolicLink()) { errors.push(`${file}: 公开候选不可包含符号链接`);continue; }
    if(hasCredential(await readFile(path,'utf8'))) errors.push(`${file}: 检测到疑似凭据；请在本机检查并移除`);
  }
  return {files:files.length,errors};
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const result=await checkRepository(resolve(dirname(fileURLToPath(import.meta.url)),'..'));
  if(result.errors.length) { console.error(result.errors.join('\n'));process.exitCode=1; }
  else console.log(`仓库检查通过：${result.files} 个 Git 已跟踪/未忽略候选文件，文章图片齐全，无未引用图片、私有目录或已识别凭据模式泄漏。`);
}
