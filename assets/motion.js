/* Adapted from Amicro FadeUp and ZoomIn easing.
 * Upstream c50be2893726bab3c14ee8fefb1287f91e0b9e57; MIT, see vendor/AMICRO-LICENSE.txt.
 * Native Web Animations adaptation: no React runtime, no scroll interception. */
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const active=new Map();
export const reduced=()=>preference.matches;
export const ease='cubic-bezier(0.16, 1, 0.3, 1)';
export function animate(el,frames,options={}){
  if(!el)return null;
  active.get(el)?.cancel();
  if(reduced())return null;
  const animation=el.animate(frames,{duration:360,easing:ease,...options});
  active.set(el,animation);
  animation.finished.catch(()=>{}).finally(()=>{if(active.get(el)===animation)active.delete(el);});
  return animation;
}
export const stop=el=>active.get(el)?.cancel();
export function reveal(el,{distance=10,delay=0,duration=400}={}){
  return animate(el,[{opacity:0,transform:`translate3d(0,${distance}px,0)`},{opacity:1,transform:'translate3d(0,0,0)'}],{duration,delay,fill:'backwards'});
}
export function fade(el,{duration=180}={}){return animate(el,[{opacity:.65},{opacity:1}],{duration});}
export function zoomIn(el,{scale=.985,duration=240}={}){return animate(el,[{opacity:0,transform:`scale(${scale})`},{opacity:1,transform:'scale(1)'}],{duration,fill:'backwards'});}
export function acknowledge(el){animate(el,[{transform:'scale(1)'},{transform:'scale(1.04)',offset:.38},{transform:'scale(1)'}],{duration:220});}
preference.addEventListener('change',()=>{if(reduced()){for(const a of active.values())a.cancel();active.clear();}});
