export const PAL=["#f97316","#38bdf8","#34d399","#fbbf24","#a78bfa","#fb7185","#2dd4bf","#f472b6","#84cc16","#60a5fa","#e879f9","#facc15"];
export const gn=(s:string)=>s.replace(/_/g," ").replace(/^./,c=>c.toUpperCase());
export const sum=(a:any[],k:string)=>a.reduce((s,x)=>s+(+x[k]||0),0);
export const nat=(a:string,b:string)=>a.localeCompare(b,undefined,{numeric:true});
export function corr(xs:number[],ys:number[]){const n=xs.length;if(n<4)return null;const mx=xs.reduce((a,b)=>a+b,0)/n,my=ys.reduce((a,b)=>a+b,0)/n;let a=0,b=0,c=0;xs.forEach((x,i)=>{a+=(x-mx)*(ys[i]-my);b+=(x-mx)**2;c+=(ys[i]-my)**2});return b&&c?a/Math.sqrt(b*c):null}
export function gstats(rows:any[],gens:string[],all:string[]){const days=new Set(rows.map(x=>x.date)).size;
  return gens.map(g=>{const r=rows.filter(x=>x.gen===g),h=sum(r,"hours"),e=sum(r,"energy"),f=sum(r,"fuel"),run=r.filter(x=>x.hours>0).length;
    return{gen:g,color:PAL[all.indexOf(g)%PAL.length],hours:h,energy:e,fuel:f,sfc:f?e/f:0,days:run,off:days-run,util:days?h/(24*days):0,load:h?e/h:0}})}
