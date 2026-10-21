import {dateKey,publicationCutoff} from '../assets/library.js';
import {OPENING_MAX as EXCERPT_MAX} from './author-opening.mjs';
import {validPublicUse} from './media.mjs';
import {articleFieldErrors} from './article-fields.mjs';
export const TOPICS = { growth: '涨粉策略', content: '内容创作', engagement: '互动分发', monetization: '商业变现', analytics: '数据复盘', platform: '平台规则' };
export {EXCERPT_MAX};
const date = /^\d{4}-\d{2}-\d{2}$/;
function validDate(value) {
  return date.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
function https(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; }
}
export function validateData(articles, syntheses, now=new Date()) {
  const errors = [];
  const cutoff=publicationCutoff(now),today=dateKey(now);
  const fail = (id, message) => errors.push(`${id}: ${message}`);
  if (!Array.isArray(articles) || !articles.length) return ['文章数据必须是非空数组'];
  if (!Array.isArray(syntheses)) return ['专题数据必须是数组'];
  const ids = new Set(), urls = new Set();
  for (const a of articles) {
    const id = a?.id || '(无 ID)';
    for(const error of articleFieldErrors(a))fail(id,error);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) fail(id, 'ID 必须是小写英文短横线标识');
    if (ids.has(id)) fail(id, '重复 ID');
    ids.add(id);
    for (const key of ['title','summary','caveat']) if (typeof a[key] !== 'string' || !a[key].trim()) fail(id, `缺少 ${key}`);
    if (!(typeof a.originalTitle === 'string' && a.originalTitle.trim()) && !(a.originalTitle === null && a.titleType === 'editorial')) fail(id, '无原标题时必须明确标记为编辑标题');
    if (!a.author?.name || !a.author?.handle || !https(a.author?.url)) fail(id, '缺少作者及可追溯主页');
    if (!https(a.sourceUrl)) fail(id, '来源必须是有效 HTTPS 链接');
    if (/^https:\/\/(?:x\.com|twitter\.com)\//i.test(a.sourceUrl||'')) {
      const post=a.sourceUrl.match(/^https:\/\/(?:x\.com|twitter\.com)\/([A-Za-z0-9_]+)\/status\/(\d+)$/);
      if (!post || post[1].toLowerCase()!==String(a.author?.handle).toLowerCase()) fail(id, 'X 来源作者须与署名 handle 一致');
      if (a.tweetUrl!==a.sourceUrl) fail(id, 'X 文章的原帖入口须与来源一致');
      const profile=a.author?.url?.match(/^https:\/\/(?:x\.com|twitter\.com)\/([A-Za-z0-9_]+)\/?$/);
      if (!profile || profile[1].toLowerCase()!==String(a.author?.handle).toLowerCase()) fail(id, 'X 作者主页须与署名 handle 一致');
    }
    if (urls.has(a.sourceUrl)) fail(id, '重复来源');
    urls.add(a.sourceUrl);
    if (a.readingUrl !== undefined) {
      const post = a.sourceUrl?.match(/^https:\/\/x\.com\/([A-Za-z0-9_]+)\/status\/(\d+)$/);
      if (!post || a.readingUrl !== `https://x.com/${post[1]}/article/${post[2]}`) fail(id, '专注阅读地址须与原帖作者和文章 ID 一致');
    }
    if (a.tweetUrl !== null && !/^https:\/\/(?:x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/\d+(?:\?.*)?$/.test(a.tweetUrl || '')) fail(id, '原帖必须为真实 status 链接或 null');
    if (a.threadUrls !== undefined) {
      const root = a.tweetUrl?.match(/^https:\/\/(?:x\.com|twitter\.com)\/([A-Za-z0-9_]+)\/status\/\d+/);
      if (!root || !Array.isArray(a.threadUrls) || a.threadUrls.length < 2 || a.threadUrls[0] !== a.tweetUrl) {
        fail(id, '线程原帖列表必须按顺序收录，且首条与原帖一致');
      } else {
        const seenPosts = new Set();
        for (const url of a.threadUrls) {
          const post = String(url).match(/^https:\/\/(?:x\.com|twitter\.com)\/([A-Za-z0-9_]+)\/status\/(\d+)$/);
          if (!post || post[1].toLowerCase() !== root[1].toLowerCase()) fail(id, '线程原帖必须是同一作者的 HTTPS status 链接');
          else if (seenPosts.has(post[2])) fail(id, '线程包含重复原帖');
          else seenPosts.add(post[2]);
        }
        if (!a.evidence?.url) fail(id, '完整线程须注明逐帖顺序的实际读取来源');
      }
    }
    if (!['thread','article','official'].includes(a.sourceType)) fail(id, '来源类型无效');
    if (a.sourceType!=='article') fail(id, '正式收录只允许文章，不收普通帖或线程');
    if (a.sourceType === 'thread' && !a.tweetUrl) fail(id, 'X 原帖记录缺少 tweetUrl');
    if (!['zh','en'].includes(a.language)) fail(id, '语言无效');
    if (!validDate(a.checkedAt)) fail(id, '核验日期无效');
    if (a.publishedAt !== null && !validDate(a.publishedAt)) fail(id, '发布日期须为有效日期或 null');
    if (!a.publishedAt || a.publishedAt<cutoff || a.publishedAt>today) fail(id, `正式收录只允许最近一年（${cutoff} 至 ${today}）且发布日期明确的资料`);
    if (!Array.isArray(a.topics) || !a.topics.length || a.topics.some(t => !Object.hasOwn(TOPICS,t))) fail(id, '主题无效');
    if (!['beginner','intermediate','advanced'].includes(a.level)) fail(id, '难度无效');
    if (typeof a.featured !== 'boolean') fail(id, '精选标记必须为布尔值');
    if (!Array.isArray(a.takeaways) || a.takeaways.length < 2 || a.takeaways.some(t => typeof t !== 'string' || !t.trim())) fail(id, '至少两个有内容的要点');
    if (!Array.isArray(a.sections) || !a.sections.length || a.sections.some(s => !s.heading || !s.body)) fail(id, '缺少站内阅读笔记');
    if (a.evidence?.status !== 'source-read' || !a.evidence?.access || !a.evidence?.note) fail(id, '缺少原文阅读证据说明');
    if (a.evidence?.url && !https(a.evidence.url)) fail(id, '实际读取页面必须为 HTTPS 链接');
    if (!['text','images','linkedMaterials'].every(key=>typeof a.readingRange?.[key]==='string' && a.readingRange[key].trim())) fail(id, '阅读范围须分别说明文字、配图与外链');
    if (!['summary-link','licensed-fulltext'].includes(a.rights?.mode) || !a.rights?.note) fail(id, '缺少有效内容模式与版权说明');
    if (a.rights?.mode === 'licensed-fulltext') {
      if (!a.rights.license || !https(a.rights.licenseUrl) || !https(a.rights.permissionUrl)) fail(id, '全文须有许可证名称、条款及作者授权依据');
      if (!a.fullText?.note || !['en','zh'].includes(a.fullText?.language) || !Array.isArray(a.fullText?.blocks) || !a.fullText.blocks.length) {
        fail(id, '全文须包含语言、修改说明与正文');
      } else {
        for (const block of a.fullText.blocks) {
          if (!['paragraph','heading','list'].includes(block.type)) fail(id, '全文块类型无效');
          else if (block.type === 'list') {
            if (!Array.isArray(block.items) || !block.items.length || block.items.some(t=>typeof t!=='string'||!t.trim())) fail(id, '全文列表不能为空');
          } else if (typeof block.text !== 'string' || !block.text.trim()) fail(id, '全文段落不能为空');
        }
      }
    } else if (a.fullText !== undefined) fail(id, '导读模式不可夹带未经许可的全文');
    if (a.socialSnapshot !== undefined) {
      const snapshot=a.socialSnapshot;
      if (!snapshot || !['bookmarks','likes'].every(key=>Number.isSafeInteger(snapshot[key])&&snapshot[key]>=0)) fail(id, '原帖快照数量须为非负安全整数');
      if (snapshot?.replies !== undefined && (!Number.isSafeInteger(snapshot.replies) || snapshot.replies<0)) fail(id, '评论快照数量须为非负安全整数');
      if (!https(snapshot?.sourceUrl) || snapshot.sourceUrl!==a.sourceUrl || !snapshot.provider || !snapshot.evidence || !Number.isFinite(Date.parse(snapshot.capturedAt))) fail(id, '原帖快照须有对应来源、采集时间、提供方与证据');
    }
    if (a.excerpt !== undefined) {
      if (typeof a.excerpt?.text !== 'string' || !a.excerpt.text.trim() || [...a.excerpt.text].length>EXCERPT_MAX) fail(id, `原文开头须为 ${EXCERPT_MAX} 字符内的非空短文`);
      if (a.excerpt?.kind!=='opening') fail(id, '文章预览必须从作者原文开头开始');
      if (typeof a.excerpt?.truncated!=='boolean') fail(id, '作者开头须说明是否省略后文');
      if (!https(a.excerpt?.sourceUrl) || a.excerpt.sourceUrl!==a.sourceUrl || !validDate(a.excerpt?.checkedAt) || !a.excerpt?.note) fail(id, '原文开头须有对应来源、核验日期与预览说明');
      const blocks=a.excerpt?.blocks;
      if (!Array.isArray(blocks)||!blocks.length||blocks.some(b=>!['unstyled','blockquote','header-one','header-two','header-three','ordered-list-item','unordered-list-item'].includes(b?.type)||typeof b?.text!=='string'||!b.text.trim())||blocks.map(b=>b.text).join('\n\n')!==a.excerpt.text) fail(id, '开头排版须保留相同原文与有效段落类型');
      else if (blocks.some(b=>!Array.isArray(b.styles)||b.styles.some(s=>!['Bold','Italic','Underline','Code'].includes(s?.style)||!Number.isInteger(s.offset)||s.offset<0||!Number.isInteger(s.length)||s.length<=0||s.offset+s.length>b.text.length))) fail(id, '开头文字格式须对应原文范围');
    }
    if (a.aiSummary !== undefined) {
      const summary=a.aiSummary;
      if (!https(summary?.sourceUrl) || summary.sourceUrl!==a.sourceUrl || !validDate(summary?.checkedAt) || !summary?.note) fail(id, 'AI 总结须有对应原文、核验日期与说明');
      if (!Array.isArray(summary?.points) || !summary.points.length || summary.points.length>5 || summary.points.some(p=>typeof p?.title!=='string'||!p.title.trim()||typeof p?.text!=='string'||!p.text.trim())) fail(id, 'AI 总结须有 1 至 5 条完整要点');
      else if ([...summary.points.map(p=>p.title+p.text).join('')].length>600) fail(id, 'AI 总结须为 600 字符内的简短提炼');
    }
    if (a.presentation !== undefined) {
      const media=a.presentation;
      if (media?.publicUse !== undefined && !validPublicUse(media.publicUse)) fail(id, '公开图片须有使用依据、有效 HTTPS 证据链接与核验日期');
      if (!media?.deck?.trim() || !media?.provenance?.trim()) fail(id, '展示方案须有导读与素材说明');
      if (media.coverKind==='editorial') {
        if (media.cover || media.avatar) fail(id, '本站文字卡片不可夹带图片；媒体有效路径与使用依据须另行核验');
      } else {
        if (media.coverKind==='text-post') fail(id, '文字卡片只允许本站 editorial 阅读重点，不允许以普通帖冒充文章');
        if (!['article-cover','article-image','post-photo'].includes(media.coverKind)) fail(id, '封面类型无效');
        if (!['cover','avatar'].every(key=>/^\.\/assets\/articles\/[a-z0-9-]+\.(jpg|png|webp)$/.test(media[key]||''))) fail(id, '文章媒体必须使用文库内的有效路径');
        if (!media.mediaCredit || !https(media.mediaSource) || media.mediaSource!==a.sourceUrl || !Number.isSafeInteger(media.coverWidth) || media.coverWidth<=0 || !Number.isSafeInteger(media.coverHeight) || media.coverHeight<=0) fail(id, '文章媒体须有来源、署名与有效尺寸');
      }
    }
    if (a.policyReview !== undefined) {
      if (!validDate(a.policyReview?.checkedAt) || !a.policyReview?.note || !Array.isArray(a.policyReview?.topics) || a.policyReview.topics.some(t=>!['authenticity','automation','rewards'].includes(t))) fail(id,'平台规则核验记录无效');
    }
    if (a.showcase === true) {
      if (!a.presentation?.cover || !a.presentation?.avatar) fail(id, '展示文章必须保留原图封面与作者头像');
      if (!a.presentation?.deck?.trim() || !a.presentation?.coverKind) fail(id, '展示文章须有明确的展示方案与导读');
      if (!a.excerpt?.text || !Array.isArray(a.aiSummary?.points) || a.aiSummary.points.length < 3) fail(id, '展示文章须有作者原文开头与至少三个阅读要点');
    }
    const text = JSON.stringify(a);
    if (/\/Users\/|Bearer\s+[\w-]+|auth_token|ct0=|file:\/\//i.test(text)) fail(id, '公开数据包含本地路径或敏感字段');
    if (/<script|javascript:/i.test(text)) fail(id, '公开数据不可包含脚本');
  }
  const sids = new Set();
  for (const s of syntheses) {
    const text = JSON.stringify(s);
    if (/\/Users\/|Bearer\s+[\w-]+|auth_token|ct0=|file:\/\//i.test(text)) fail(s.id || '(专题)', '公开专题包含本地路径或敏感字段');
    if (/<script|javascript:/i.test(text)) fail(s.id || '(专题)', '公开专题不可包含脚本');
    if (!s.id || sids.has(s.id)) fail(s.id || '(专题)', '专题 ID 缺失或重复');
    sids.add(s.id);
    for (const key of ['title','question','intro','limitation']) if (!s[key]) fail(s.id, `专题缺少 ${key}`);
    if (!Array.isArray(s.points) || !s.points.length) { fail(s.id, '专题缺少观点'); continue; }
    const refs = new Set();
    for (const p of s.points) {
      if (!p.title || !p.body || !Array.isArray(p.sourceIds) || !p.sourceIds.length) fail(s.id, '每条归纳必须有内容与来源');
      for (const ref of p.sourceIds || []) { refs.add(ref); if (!ids.has(ref)) fail(s.id, `引用不存在的文章 ${ref}`); }
    }
    if (refs.size < 2) fail(s.id, '专题至少引用两篇文章');
  }
  return errors;
}
