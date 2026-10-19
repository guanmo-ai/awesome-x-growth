export const OPENING_TARGET=100;
export const OPENING_MAX=220;
const length=text=>[...text.replace(/\s/gu,'')].length;

export function extractAuthorOpening(sourceBlocks,{target=OPENING_TARGET,max=OPENING_MAX}={}){
  const blocks=sourceBlocks.filter(b=>typeof b.text==='string'&&b.text.trim()&&b.type!=='atomic');
  const source=blocks.map(b=>b.text).join('\n\n');
  if(!source)throw new Error('缺少作者正文，不能生成开头预览');
  const candidates=new Set();
  let offset=0;
  for(const block of blocks){
    const text=block.text;
    if(!block.type.startsWith('header')){
      const urls=[...text.matchAll(/https?:\/\/[^\s。！？]+/gu)].map(m=>[m.index,m.index+m[0].length]);
      for(const match of text.matchAll(/(?:[。！？!?]+|\.(?=\s|$))[”’」』）】》"')]*\s*/gu)){
        if(!urls.some(([start,end])=>match.index>=start&&match.index<end))candidates.add(offset+match.index+match[0].trimEnd().length);
      }
      // Preserve complete unpunctuated source paragraphs/list items, but do
      // not stop at a short unmarked subheading such as "先说清楚".
      if((length(text)>=15||block.type.endsWith('list-item'))&&!/[，,、：:；;（(—-]\s*$/u.test(text))candidates.add(offset+text.trimEnd().length);
    }
    offset+=text.length+2;
  }
  const ends=[...candidates].filter(end=>[...source.slice(0,end)].length<=max);
  if(!ends.length)throw new Error(`首句超过 ${max} 字符，须人工核对，不能截断句子`);
  ends.sort((a,b)=>Math.abs(length(source.slice(0,a))-target)-Math.abs(length(source.slice(0,b))-target)||a-b);
  const end=ends[0],selected=[];
  offset=0;
  for(const block of blocks){
    if(offset>=end)break;
    const text=block.text.slice(0,end-offset);
    const styles=(block.styles||block.inlineStyleRanges||[]).flatMap(s=>{
      const size=Math.min(s.length,text.length-s.offset);
      return size>0&&['Bold','Italic','Underline','Code'].includes(s.style)?[{offset:s.offset,length:size,style:s.style}]:[];
    });
    selected.push({type:block.type,text,styles});
    offset+=block.text.length+2;
  }
  const text=selected.map(b=>b.text).join('\n\n');
  return {text,blocks:selected,truncated:end<source.trimEnd().length};
}
