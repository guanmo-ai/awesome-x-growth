import {renderAuthorOpening} from '../assets/opening.js';
import {renderArticleNotes} from '../assets/article-notes.js';
import {includeArticleMedia} from './media.mjs';
import {projectArticleFields} from './article-fields.mjs';
export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function siteBase(value=''){
  if(!value)return '';
  const u=new URL(value);
  if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash)throw new Error('SITE_URL 必须是无凭据、查询参数和片段的 HTTPS 站点根地址');
  return u.href.replace(/\/?$/,'/');
}
export function socialMetadata({title,description,path='',base='',type='website',relativePrefix='./'}){
  const esc=escapeHTML,url=base?new URL(path,base).href:'',image=base?new URL('assets/share-card.png',base).href:`${relativePrefix}assets/share-card.png`;
  return `<!-- SOCIAL_META_START -->
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="Awesome X Growth">
  <meta property="og:locale" content="zh_CN">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${esc(image)}">
  <meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Awesome X Growth：推特运营与涨粉">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(image)}"><meta name="twitter:creator" content="@guanmo_ai">
  ${url?`<link rel="canonical" href="${esc(url)}"><meta property="og:url" content="${esc(url)}">`:''}
  <!-- SOCIAL_META_END -->`;
}
export function addSocialMetadata(html,options){
  const meta=socialMetadata(options);
  return /<!-- SOCIAL_META_START -->[\s\S]*?<!-- SOCIAL_META_END -->/.test(html)?html.replace(/<!-- SOCIAL_META_START -->[\s\S]*?<!-- SOCIAL_META_END -->/,meta):html.replace('</head>',meta+'\n</head>');
}
export function publicArticle(article,options={}){
  const fields=['id','title','originalTitle','author','sourceUrl','readingUrl','tweetUrl','sourceType','language','publishedAt','checkedAt','topics','showcase','shelfOrder','excerpt','aiSummary','rights','socialSnapshot','presentation'];
  const result=projectArticleFields(article,fields);
  if (article.presentation) {
    if (includeArticleMedia(article,options)) {
      result.presentation={...result.presentation};
      if (!options.preview) delete result.presentation.localPreview;
    } else result.presentation={coverKind:'none'};
  }
  return result;
}
export function articlePage(a,base=''){
  const e=escapeHTML,title=a.originalTitle||a.title,description=a.aiSummary.points.map(p=>p.title).join('；'),path=`articles/${a.id}.html`;
  const cover=includeArticleMedia(a)?`<figure class="viewer-cover"><img src="../${e(a.presentation.cover.replace(/^\.\//,''))}" width="${e(a.presentation.coverWidth)}" height="${e(a.presentation.coverHeight)}" alt="${e(a.presentation.coverAlt||title)}" decoding="async"><figcaption>原文配图 · ${e(a.presentation.mediaCredit)}</figcaption></figure>`:'';
  const external=(url,label)=>`<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a>`;
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${e(description)}"><title>${e(title)} · Awesome X Growth</title><link rel="icon" href="../assets/favicon.svg"><link rel="stylesheet" href="../assets/style.css">${socialMetadata({title,description,path,base,type:'article',relativePrefix:'../'})}</head>
<body><a class="skip-link" href="#main">跳到内容</a><header class="standalone-header"><a href="../">Awesome X Growth.</a><span>推特运营与涨粉</span></header><main id="main" class="standalone-article" tabindex="-1"><article>${cover}<p class="eyebrow">文章预览 · 作者原文开头与 AI 总结</p><h1>${e(title)}</h1><p class="standalone-byline">${external(a.author.url,`${a.author.name} @${a.author.handle}`)} · <time datetime="${e(a.publishedAt)}">${e(a.publishedAt)}</time></p><section class="viewer-excerpt"><h2>作者原文开头</h2><blockquote class="opening-text" cite="${e(a.sourceUrl)}">${renderAuthorOpening(a.excerpt)}</blockquote></section><p class="standalone-source">${external(a.readingUrl||a.sourceUrl,'在 X 阅读完整原文')}</p><section class="viewer-summary"><h2>AI 总结</h2><ol>${a.aiSummary.points.map(p=>`<li><div><h3>${e(p.title)}</h3><p>${e(p.text)}</p></div></li>`).join('')}</ol></section>${renderArticleNotes(a)}</article><a class="browse-all" href="../?article=${a.id}">在文库中继续浏览 →</a></main><footer class="standalone-footer">本站不转载全文。 · <a href="../CONTENT_POLICY.md">内容政策</a></footer></body></html>`;
}
export const PUBLIC_ASSETS=['tools/tweet-hunter-x.jpg','tools/x-search-pro.jpg','tools/bookmark-x.png','tools/typefully.png','tools/x-viral-monitor.jpg','tools/dewey.jpg','tools/bookmarkbrain.jpg','tools/xtap.png','tools/fxembed.svg','tools/postiz.png','app.js','library.js','guides.js','policies.js','motion.js','opening.js','article-notes.js','tools.js','tools-library.js','style.css','tools.css','favicon.svg','share-card.png','fonts/Newsreader-latin.woff2','fonts/DMSans-latin.woff2','fonts/OFL-Newsreader.txt','fonts/OFL-DMSans.txt','vendor/AMICRO-LICENSE.txt','vendor/AWESOME-AI-MOTION-LICENSE.txt'];
export const PUBLIC_DOCS=['CATALOG.md','AI_DIGEST.md','TOOLS.md','THIRD_PARTY.md','RELEASE.md'];
