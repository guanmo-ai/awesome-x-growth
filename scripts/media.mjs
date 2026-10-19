const nonempty = value => typeof value === 'string' && !!value.trim();
export function validPublicUse(value) {
  if (!value || !nonempty(value.license) || !/^\d{4}-\d{2}-\d{2}$/.test(value.checkedAt || '')) return false;
  const date = new Date(value.checkedAt);
  if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0,10) !== value.checkedAt) return false;
  try {
    const url = new URL(value.evidenceUrl);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch { return false; }
}
// 图片是文章展示的一部分；publicUse 记录额外依据，不作为隐藏图片的开关。
export function includeArticleMedia(article) {
  return !!(article.presentation?.cover && article.presentation?.avatar);
}
// Call with the visible article set used for pages and public JSON.
export function articleMediaFiles(articles, options={}) {
  return [...new Set(articles.filter(a=>includeArticleMedia(a,options))
    .flatMap(a=>[a.presentation.cover,a.presentation.avatar]).filter(Boolean)
    .map(path=>path.replace(/^\.\//,'')))];
}
