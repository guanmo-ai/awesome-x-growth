import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,mkdtemp,cp,rm,access} from 'node:fs/promises';
import {execFileSync,spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateData} from '../scripts/validate.mjs';
import {validPublicUse} from '../scripts/media.mjs';
import {publicArticle} from '../scripts/publication.mjs';
import {checkRepository,hasCredential,repositoryPathErrors} from '../scripts/check-repo.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const articles=JSON.parse(await readFile(resolve(root,'data/articles.json'),'utf8'));
const syntheses=JSON.parse(await readFile(resolve(root,'data/synthesis.json'),'utf8'));
const publicUse={license:'测试夹具：自有素材',evidenceUrl:'https://example.test/media-permission',checkedAt:'2026-10-19'};

test('localPreview 不能掩盖空对象、错误类型、缺字段或非法日期的 publicUse',()=>{
  for(const value of [{},true,[],{...publicUse,license:' '},{...publicUse,evidenceUrl:'https://user:secret@example.test/'},{...publicUse,checkedAt:'2026-02-30'}]) {
    const data=structuredClone(articles),a=data.find(a=>a.showcase);
    a.presentation.publicUse=value;
    assert.equal(validPublicUse(value),false);
    assert.ok(validateData(data,syntheses).some(e=>e.includes('公开图片须有使用依据')));
  }
  assert.equal(validPublicUse(publicUse),true);
});

test('阅读范围必须分别说明文字、配图和外链，缺失或空白均拒绝',()=>{
  for(const key of [null,'text','images','linkedMaterials']) {
    const data=structuredClone(articles);
    if(key===null)delete data[0].readingRange;else data[0].readingRange[key]=' ';
    assert.ok(validateData(data,syntheses).some(e=>e.includes('阅读范围')));
  }
});

test('公开投影保留每篇原图，移除本地审阅标记，也不改写原始文章',()=>{
  const a=articles.find(a=>a.presentation?.localPreview),before=structuredClone(a);
  assert.equal(publicArticle(a).presentation.cover,a.presentation.cover);
  assert.equal(publicArticle(a).presentation.avatar,a.presentation.avatar);
  assert.equal(publicArticle(a).presentation.localPreview,undefined);
  assert.ok(publicArticle(a,{preview:true}).presentation.cover);
  assert.deepEqual(a,before);
});

test('未知字段不能夹带正文进入源数据或公开投影，包含嵌套对象与数组',()=>{
  const marker='PRIVATE_FULL_TEXT_PROBE';
  for(const mutate of [
    a=>a.rawContent=marker,
    a=>a.author.rawContent=marker,
    a=>a.excerpt.blocks[0].rawContent=marker,
    a=>a.aiSummary.points[0].rawContent=marker,
    a=>a.presentation.rawContent=marker,
    a=>a.rights.rawContent=marker,
    a=>a.socialSnapshot.rawContent=marker,
    a=>a.readingRange.rawContent=marker,
  ]){
    const data=structuredClone(articles),a=data.find(a=>a.showcase&&a.socialSnapshot);
    mutate(a);
    const before=structuredClone(a);
    assert.ok(validateData(data,syntheses).some(e=>e.includes('未声明字段')));
    assert.ok(!JSON.stringify(publicArticle(a)).includes(marker));
    assert.deepEqual(a,before);
  }
});

test('标量字段不能通过嵌套对象夹带未声明内容',()=>{
  const data=structuredClone(articles),a=data.find(a=>a.showcase);
  a.author.name={rawContent:'PRIVATE_FULL_TEXT_PROBE'};
  assert.ok(validateData(data,syntheses).some(e=>e.includes('字段结构无效')));
  assert.ok(!JSON.stringify(publicArticle(a)).includes('PRIVATE_FULL_TEXT_PROBE'));
});

test('识别高置信度凭据模式，不把普通变量名当凭据',()=>{
  assert.equal(hasCredential('ghp_'+'A'.repeat(36)),true);
  assert.equal(hasCredential('API_KEY=你的环境变量'),false);
});

test('每篇图片必须纳入仓库候选以支持干净克隆',()=>{
  const a=structuredClone(articles.find(a=>a.showcase));
  assert.equal(repositoryPathErrors([], [a]).length,2);
  assert.deepEqual(repositoryPathErrors([a.presentation.cover,a.presentation.avatar].map(p=>p.replace(/^\.\//,'')),[a]),[]);
});
test('本地待审研究不能通过另一个 data/research 路径进入开源候选',()=>{
  assert.ok(repositoryPathErrors(['data/research/unreviewed.json'],[]).some(e=>e.includes('不可公开本地材料')));
});

test('干净副本、正式子目录、隐藏媒体与本地预览的完整构建边界',async t=>{
  const dir=await mkdtemp(resolve(tmpdir(),'x-growth-release-'));
  t.after(()=>rm(dir,{recursive:true,force:true}));
  for(const name of ['scripts','assets','data','docs','index.html','tools.html','LICENSE','CONTENT_POLICY.md','package.json','.gitignore']) {
    await cp(resolve(root,name),resolve(dir,name),{recursive:true});
  }
  const run=(script,args=[],env={})=>spawnSync(process.execPath,[script,...args],{cwd:dir,encoding:'utf8',env:{...process.env,SITE_URL:'',...env}});
  const success=(script,args=[],env={})=>{const r=run(script,args,env);assert.equal(r.status,0,r.stderr||r.stdout);return r;};
  const exists=async path=>access(resolve(dir,path)).then(()=>true,()=>false);
  const save=data=>writeFile(resolve(dir,'data/articles.json'),JSON.stringify(data,null,2)+'\n');

  // A fresh checkout must preserve the article images, not silently omit them.
  assert.equal(await exists('assets/articles'),true);
  success('scripts/build.mjs');success('scripts/check-release.mjs');
  assert.equal(await exists('dist/assets/articles'),true);
  const payload=await readFile(resolve(dir,'dist/data/articles.json'),'utf8');
  assert.ok(!/localPreview/.test(payload));
  for(const a of JSON.parse(payload)) {
    assert.ok(a.presentation.cover && a.presentation.avatar);
    assert.equal(await exists('dist/'+a.presentation.cover),true);
    assert.equal(await exists('dist/'+a.presentation.avatar),true);
    assert.ok((await readFile(resolve(dir,`dist/articles/${a.id}.html`),'utf8')).includes('../'+a.presentation.cover.slice(2)));
  }
  success('scripts/build.mjs',[],{SITE_URL:'https://example.test/growth/'});
  success('scripts/check-release.mjs');
  assert.match(await readFile(resolve(dir,'dist/sitemap.xml'),'utf8'),/https:\/\/example.test\/growth\//);

  // The original empty-object bypass must fail even with valid localPreview.
  const invalid=structuredClone(articles);
  for(const a of invalid.filter(a=>a.presentation?.localPreview))a.presentation.publicUse={};
  await save(invalid);
  const rejected=run('scripts/build.mjs',[],{SITE_URL:'https://example.test/growth/'});
  assert.notEqual(rejected.status,0);assert.match(rejected.stderr,/公开图片须有使用依据/);
  assert.notEqual(run('scripts/check-release.mjs').status,0);

  const data=structuredClone(articles),a=data.find(a=>a.id==='weiyu-mainline-and-materials');
  await mkdir(resolve(dir,'assets/articles'),{recursive:true});
  // Synthetic local test pixels, never added to the product's article assets.
  const pixel=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jM1sAAAAASUVORK5CYII=','base64');
  a.presentation={...a.presentation,publicUse};
  for(const p of [a.presentation.cover,a.presentation.avatar])await writeFile(resolve(dir,p),pixel);
  await save(data);success('scripts/build.mjs');success('scripts/check-release.mjs');
  assert.equal(await exists('dist/'+a.presentation.cover),true);
  const publicData=JSON.parse(await readFile(resolve(dir,'dist/data/articles.json'),'utf8'));
  assert.equal(publicData.find(x=>x.id===a.id).presentation.localPreview,undefined);

  a.showcase=false;await save(data);success('scripts/build.mjs');success('scripts/check-release.mjs');
  assert.equal(await exists('dist/'+a.presentation.cover),false);
  assert.equal(await exists(`dist/articles/${a.id}.html`),false);

  a.showcase=true;delete a.presentation.publicUse;
  await save(data);success('scripts/build.mjs');
  const publicManifest=await readFile(resolve(dir,'dist/release.json'),'utf8');
  success('scripts/build.mjs',['--preview']);
  assert.equal(await exists('.local/preview/'+a.presentation.cover),true);
  assert.equal(await readFile(resolve(dir,'dist/release.json'),'utf8'),publicManifest);
  assert.equal(JSON.parse(await readFile(resolve(dir,'.local/preview/release.json'),'utf8')).mode,'local-preview');
  assert.notEqual(run('scripts/build.mjs',['--preview'],{SITE_URL:'https://example.test/'}).status,0);

  // Preserve referenced images while rejecting unrelated files and private material.
  execFileSync('git',['init','-q'],{cwd:dir});
  assert.deepEqual((await checkRepository(dir)).errors,[]);
  await writeFile(resolve(dir,'assets/articles/unreferenced.png'),pixel);
  assert.ok((await checkRepository(dir)).errors.some(e=>e.includes('图片未被文章数据引用')));
  await rm(resolve(dir,'assets/articles/unreferenced.png'));
  await rm(resolve(dir,a.presentation.cover));
  assert.notEqual(run('scripts/build.mjs').status,0,'缺图必须报错，不能生成无图页面');
  await cp(resolve(dir,'.local/preview'),resolve(dir,'dist'),{recursive:true});
  assert.notEqual(run('scripts/check-release.mjs').status,0,'把预览目录改名为 dist 也不能发行');
});
