const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderArticleNotes(article){
  const snapshot=article.socialSnapshot?.capturedAt?.slice(0,10);
  const ranges=[['text','文字'],['images','配图'],['linkedMaterials','外链']];
  return `<details class="article-notes"><summary>阅读说明</summary><p>${esc(article.caveat)}</p><p class="notes-dates">内容核对：${esc(article.checkedAt)}${snapshot?` · 互动快照：${esc(snapshot)}（UTC，非实时）`:''}</p><dl>${ranges.map(([key,label])=>`<div><dt>${label}</dt><dd>${esc(article.readingRange?.[key])}</dd></div>`).join('')}</dl></details>`;
}
