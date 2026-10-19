const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tags={Bold:'strong',Italic:'em',Underline:'u',Code:'code'};
function inline(text,styles=[]){
  const ranges=styles.filter(s=>tags[s.style]&&Number.isInteger(s.offset)&&s.offset>=0&&Number.isInteger(s.length)&&s.length>0&&s.offset+s.length<=text.length);
  const points=[...new Set([0,text.length,...ranges.flatMap(s=>[s.offset,s.offset+s.length])])].sort((a,b)=>a-b);
  return points.slice(0,-1).map((start,i)=>{
    const end=points[i+1];let html=esc(text.slice(start,end));
    for(const s of ranges.filter(s=>s.offset<=start&&s.offset+s.length>=end))html=`<${tags[s.style]}>${html}</${tags[s.style]}>`;
    return html;
  }).join('');
}
export function renderAuthorOpening(opening){
  const blocks=opening.blocks||opening.text.split(/\n\s*\n/).filter(p=>p.trim()).map(text=>({type:'unstyled',text}));
  const content=(block,index)=>inline(block.text,block.styles)+(opening.truncated&&index===blocks.length-1&&!/[.…]{2,}\s*$/u.test(block.text)?'<span class="opening-ellipsis" aria-label="后文省略">……</span>':'');
  const html=[];
  for(let i=0;i<blocks.length;i++){
    const block=blocks[i],text=content(block,i);
    if(['ordered-list-item','unordered-list-item'].includes(block.type)){
      const tag=block.type==='ordered-list-item'?'ol':'ul',items=[`<li>${text}</li>`];
      while(blocks[i+1]?.type===block.type){const next=blocks[++i];items.push(`<li>${content(next,i)}</li>`);}
      html.push(`<${tag}>${items.join('')}</${tag}>`);
    }else if(block.type==='blockquote')html.push(`<blockquote><p>${text}</p></blockquote>`);
    else if(block.type.startsWith('header'))html.push(`<h3>${text}</h3>`);
    else html.push(`<p>${text}</p>`);
  }
  return html.join('');
}
