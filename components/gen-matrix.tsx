"use client";
import {gn,PAL} from "@/lib/gens";
export default function Matrix({rows,gens,all,metric}:any){
  const days=[...new Set(rows.map((r:any)=>r.date))].sort() as string[],M:any={};rows.forEach((r:any)=>M[r.date+"|"+r.gen]=r);
  const val=(r:any)=>!r?0:metric==="hours"?r.hours:metric==="energy"?r.energy:metric==="fuel"?r.fuel:(r.fuel?r.energy/r.fuel:0);
  const v=rows.map(val).filter((x:number)=>x>0),mx=Math.max(1,...v),mn=Math.min(...(v.length?v:[0]));
  const fmt=(x:number)=>!x?"–":metric==="sfc"?x.toFixed(2):Math.round(x).toLocaleString();
  const lo=metric==="sfc"?mn*0.98:0;
  return <div className="overflow-x-auto"><table className="border-separate border-spacing-1 text-xs"><thead><tr><th className="sticky left-0 bg-card pr-2 text-left text-mut">Day</th>{gens.map((g:string)=><th key={g} className="px-2 pb-1 font-medium"><span className="mr-1 inline-block size-2 rounded-full" style={{background:PAL[all.indexOf(g)%PAL.length]}}/>{gn(g)}</th>)}</tr></thead>
    <tbody>{days.map(d=><tr key={d}><td className="sticky left-0 bg-card pr-2 text-mut">{+d.slice(8)}</td>{gens.map((g:string)=>{const x=val(M[d+"|"+g]),p=x>0?12+88*Math.max(0,(x-lo))/Math.max(1e-9,mx-lo):0;
      return <td key={g} title={`${d} ${gn(g)}`} style={{background:x>0?`color-mix(in oklab,var(--brand) ${p}%,transparent)`:"transparent"}} className="min-w-14 rounded-md px-2 py-1.5 text-center tabular-nums">{fmt(x)}</td>})}</tr>)}</tbody></table></div>}
