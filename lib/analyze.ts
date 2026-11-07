import * as XLSX from "xlsx";
const toDate=(v:any)=>typeof v==="number"?new Date(Math.round((v-25569)*1440)*6e4):new Date(String(v).replace(" ","T")+"Z");
export function parseFiles(bufs:Buffer[]){
  const map=new Map<number,any>();
  for(const b of bufs){
    const sh=XLSX.read(b,{type:"buffer"}).Sheets[XLSX.read(b,{type:"buffer"}).SheetNames[0]];
    const rows:any[][]=XLSX.utils.sheet_to_json(sh,{header:1,raw:true,defval:null});
    const h=rows[0].map(x=>String(x??"").toLowerCase()),f=(...k:string[])=>h.findIndex(x=>k.every(y=>x.includes(y)));
    const c={d:f("date"),wh:f("import","wh"),v:f("import","varh"),pf:f("pf")>=0?f("pf"):f("power factor"),w:f("import","demand"),s:f("status")};
    if(c.d<0||c.wh<0)throw new Error("Missing DateTime or Import Wh column in a file");
    for(const r of rows.slice(1)){const t=toDate(r[c.d]);if(isNaN(+t))continue;
      map.set(+t,{t,wh:+r[c.wh]||0,w:c.w>=0?+r[c.w]||0:null,v:c.v>=0?+r[c.v]||0:0,pf:c.pf>=0&&r[c.pf]!=null?+r[c.pf]:null,s:c.s>=0?String(r[c.s]??""):""})}
  }
  const R=[...map.values()].sort((a,b)=>+a.t-+b.t);
  if(R.length<10)throw new Error("Not enough readable rows");
  const d=R.slice(1,60).map((r,i)=>(+r.t-+R[i].t)/6e4).sort((a,b)=>a-b),iv=d[d.length>>1]||15;
  for(const r of R){if(r.w==null)r.w=r.wh*60/iv;r.h=r.t.getUTCHours();r.day=r.t.toISOString().slice(0,10)}
  return{recs:R,iv};
}
export function analyze(R:any[],iv:number){
  const n=R.length,S=Math.round(1440/iv);let mx=R[0],mn:any=null,zero=0,wh=0,vv=0,w=0;
  for(const r of R){wh+=r.wh;vv+=r.v;w+=r.w;if(r.w>mx.w)mx=r;if(r.w>0&&(!mn||r.w<mn.w))mn=r;if(!r.w)zero++}
  const H=(f:(r:any)=>number|null)=>{const s=Array(24).fill(0),c=Array(24).fill(0);for(const r of R){const x=f(r);if(x!=null){s[r.h]+=x;c[r.h]++}}return s.map((x,i)=>c[i]?x/c[i]:0)};
  const mxh=Array(24).fill(0);for(const r of R)mxh[r.h]=Math.max(mxh[r.h],r.w);
  const days:any={};for(const r of R){const d=(days[r.day]??={e:0,n:0,pk:0});d.e+=r.wh;d.n++;d.pk=Math.max(d.pk,r.w)}
  const daily=Object.entries(days).filter(([,d]:any)=>d.n>=.9*S).map(([k,d]:any)=>({d:k.slice(5),e:d.e,pk:d.pk}));
  const s=R.map(r=>r.w).sort((a:number,b:number)=>b-a),ldc=Array.from({length:101},(_,i)=>s[Math.min(n-1,Math.round(i/100*(n-1)))]);
  const cnt:any={};for(const r of R)cnt[r.s]=(cnt[r.s]||0)+1;const top=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];
  return{k:{n,iv,maxW:mx.w,maxT:mx.t.toISOString().slice(0,16).replace("T"," "),energyWh:wh,avgW:w/n,lf:w/n/mx.w,minW:mn?.w??0,pf:wh/Math.hypot(wh,vv)||0,varh:vv,flags:R.filter(r=>r.s!==top).length,zero},
    hourly:{avg:H(r=>r.w),max:mxh,pf:H(r=>r.pf)},daily,ldc};
}
