// Field shapes are shared by source validation and public projection.
// true denotes a JSON scalar; an array describes its item shape.
const scalars=names=>Object.fromEntries(names.split(' ').map(name=>[name,true]));
const style=scalars('offset length style');
const openingBlock={...scalars('type text'),styles:[style]};
const publicUse=scalars('license evidenceUrl checkedAt');
const shape={
  ...scalars('id title originalTitle titleType sourceUrl readingUrl tweetUrl sourceType language publishedAt checkedAt addedAt level featured showcase shelfOrder curationRank summary caveat dateEvidence'),
  author:scalars('name handle url'),
  topics:[true],takeaways:[true],threadUrls:[true],
  sections:[scalars('heading body')],
  evidence:{...scalars('status access url note secondaryUrl'),supportingSections:[true]},
  rights:scalars('mode note license licenseUrl permissionUrl'),
  readingRange:scalars('text images linkedMaterials'),
  excerpt:{...scalars('text sourceUrl checkedAt note kind truncated'),blocks:[openingBlock]},
  aiSummary:{...scalars('sourceUrl checkedAt note'),points:[scalars('title text')]},
  socialSnapshot:scalars('likes bookmarks replies capturedAt provider sourceUrl evidence'),
  presentation:{
    ...scalars('cover avatar deck coverWidth coverHeight coverKind coverAlt mediaCredit mediaSource provenance coverOriginalUrl avatarOriginalUrl mediaCheckedAt'),
    localPreview:scalars('requestedAt note'),publicUse,
  },
  policyReview:{...scalars('checkedAt note'),topics:[true],sources:[true]},
  learning:{...scalars('stage lesson action'),goals:[true]},
  cover:scalars('tone eyebrow title caption'),
  fullText:{...scalars('language note'),blocks:[{...scalars('type text'),items:[true]}]},
};
const scalar=value=>value===null||['string','number','boolean'].includes(typeof value);
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);

export function articleFieldErrors(article){
  const errors=[];
  function visit(value,fields,path){
    if(fields===true){if(!scalar(value))errors.push(`字段结构无效 ${path}`);return;}
    if(Array.isArray(fields)){
      if(!Array.isArray(value)){errors.push(`字段结构无效 ${path}`);return;}
      value.forEach((item,index)=>visit(item,fields[0],`${path}[${index}]`));return;
    }
    if(!object(value)){errors.push(`字段结构无效 ${path}`);return;}
    for(const key of Object.keys(value)){
      const field=path?`${path}.${key}`:key;
      if(!Object.hasOwn(fields,key))errors.push(`未声明字段 ${field}`);
      else visit(value[key],fields[key],field);
    }
  }
  visit(article,shape,'');
  return errors;
}

export function projectArticleFields(article,fields){
  function pick(value,fields){
    if(fields===true)return scalar(value)?value:undefined;
    if(Array.isArray(fields))return Array.isArray(value)?value.map(item=>pick(item,fields[0])):undefined;
    if(!object(value))return undefined;
    return Object.fromEntries(Object.keys(fields).flatMap(key=>{
      if(!Object.hasOwn(value,key))return [];
      const selected=pick(value[key],fields[key]);
      return selected===undefined?[]:[[key,selected]];
    }));
  }
  return pick(article,Object.fromEntries(fields.map(key=>[key,shape[key]])));
}
