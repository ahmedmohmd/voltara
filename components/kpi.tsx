"use client";
import {useEffect,useState} from "react";
export default function Kpi({l,val,fmt,s,hero,i=0}:any){const [x,setX]=useState(0);
  useEffect(()=>{if(matchMedia("(prefers-reduced-motion:reduce)").matches){setX(val);return}let r=0;const t0=performance.now();
    const f=(t:number)=>{const p=Math.min(1,(t-t0)/900);setX(val*(1-Math.pow(1-p,3)));if(p<1)r=requestAnimationFrame(f)};r=requestAnimationFrame(f);return()=>cancelAnimationFrame(r)},[val]);
  return <div style={{animation:`rise .6s ${i*.06}s both`}} className={"rounded-2xl border p-5 shadow-sm "+(hero?"col-span-2 border-brand bg-gradient-to-br from-brand to-brand-dk text-white shadow-lg shadow-brand/20":"border-line bg-card/80 backdrop-blur")}>
    <p className={"text-sm "+(hero?"text-white/80":"text-mut")}>{l}</p><p className={"font-semibold "+(hero?"text-4xl":"text-2xl")}>{fmt(x)}</p><p className={"text-xs "+(hero?"text-white/80":"text-mut")}>{s}</p></div>}
