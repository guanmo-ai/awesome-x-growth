import test from 'node:test';
import assert from 'node:assert/strict';
import { publicPath, createServer } from '../scripts/serve.mjs';
import {mkdtemp,mkdir,writeFile,symlink,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';

test('只服务公开文件，拒绝研究证据、Git、路径穿越和异常编码',()=>{
  assert.equal(publicPath('/?article=test'),'index.html');
  assert.equal(publicPath('/data/articles.json'),'data/articles.json');
  assert.equal(publicPath('/tools.html'),'tools.html');
  for (const path of ['/data/research/candidate.json','/.research/evidence.json','/.git/config','/scripts/serve.mjs','/assets/../../.git/config','/assets/%2e%2e/%2e%2e/.git/config','/assets/\\private','/%E0%A4%A','/assets/.hidden']) assert.equal(publicPath(path),null,path);
});
test('公开目录中的符号链接不能读取目录外文件',async t=>{
  const dir=await mkdtemp(join(tmpdir(),'x-growth-server-'));
  t.after(()=>rm(dir,{recursive:true,force:true}));
  const site=join(dir,'site');await mkdir(join(site,'assets'),{recursive:true});
  await writeFile(join(dir,'private.txt'),'outside-public-root');
  await symlink(join(dir,'private.txt'),join(site,'assets','linked.txt'));
  const server=createServer(site);
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{assert.equal((await fetch(`http://127.0.0.1:${server.address().port}/assets/linked.txt`)).status,404);}
  finally{await new Promise(resolve=>server.close(resolve));}
});
test('HTTP 数据可读、HEAD 无正文、私有文件404、写请求405',async()=>{
  const server=createServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`;
  try {
    const data=await fetch(`${origin}/data/articles.json`);
    assert.equal(data.status,200);
    assert.match(data.headers.get('content-type'),/application\/json/);
    assert.ok(Array.isArray(await data.json()));
    const toolPage=await fetch(`${origin}/tools.html`);
    assert.equal(toolPage.status,200); assert.match(await toolPage.text(),/插件与工具/);
    const icon=await fetch(`${origin}/assets/favicon.svg`);
    assert.equal(icon.status,200);
    assert.equal(icon.headers.get('content-type'),'image/svg+xml');
    const head=await fetch(`${origin}/data/articles.json`,{method:'HEAD'});
    assert.equal(head.status,200); assert.equal(await head.text(),'');
    assert.equal((await fetch(`${origin}/.research/hidden`)).status,404);
    assert.equal((await fetch(`${origin}/data/articles.json`,{method:'POST'})).status,405);
  } finally { await new Promise(resolve=>server.close(resolve)); }
});
