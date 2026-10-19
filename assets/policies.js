export const POLICY_CHECKED_AT='2026-10-16';
export const POLICY_SOURCES={
  authenticity:{label:'真实互动规则',url:'https://help.x.com/en/rules-and-policies/authenticity',text:'避免协调互换点赞、回复、转发或关注；作者的历史做法不等于当前可照做的增长方法。'},
  automation:{label:'自动化规则',url:'https://help.x.com/en/rules-and-policies/x-automation',text:'辅助选题与人工审稿应和自动执行区分。X 禁止用脚本操作网站的非 API 自动化；AI 自动回复还需事先获得明确书面批准。'},
  rewards:{label:'原创奖励规则',url:'https://help.x.com/en/using-x/original-content-rewards',text:'旧收益分成已于 2026-09-07 结束；原创奖励有单独资格与内容要求，历史收益不能直接套用。'}
};
export function articlePolicyKeys(article){
  return article.policyReview?.topics||[];
}
