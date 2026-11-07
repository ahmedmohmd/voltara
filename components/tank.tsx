"use client";
import {useEffect,useState} from "react";
export default function Tank({name,cap,liters,low=20,i=0,note}:any){const p=cap?Math.max(0,Math.min(100,liters/cap*100)):0,[s,setS]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setS(p),60+i*90);return()=>clearTimeout(t)},[p,i]);
  const lv=p<low?["#fb7185","#be123c"]:p<low*2.5?["#fbbf24","#d97706"]:["var(--brand-lt)","var(--brand-dk)"];
  return <div className="rounded-2xl border border-line bg-card/80 p-4 text-center backdrop-blur transition hover:-translate-y-1 hover:border-brand/60" style={{animation:`rise .6s ${i*.07}s both`}}>
    <div className="relative mx-auto h-44 w-28 overflow-hidden rounded-[2rem] border-2 border-line bg-bg shadow-inner">
      <div className="absolute inset-x-0 bottom-0 transition-[height] duration-[1600ms] ease-out" style={{height:s+"%",background:`linear-gradient(180deg,${lv[0]},${lv[1]})`}}>
        {s>1&&<><svg className="wave absolute -top-2.5 left-0 h-3 w-[200%]" viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M0 6Q12.5 0 25 6T50 6T75 6T100 6T125 6T150 6T175 6T200 6V12H0Z" fill={lv[0]}/></svg>
          <svg className="wave2 absolute -top-1.5 left-0 h-3 w-[200%] opacity-60" viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M0 6Q12.5 12 25 6T50 6T75 6T100 6T125 6T150 6T175 6T200 6V12H0Z" fill={lv[1]}/></svg>
          {[18,50,78].map((x,k)=><span key={x} className="bub absolute bottom-1 size-1.5 rounded-full bg-white/70" style={{left:x+"%",animationDelay:k*1.3+"s"}}/>)}</>}</div>
      {[25,50,75].map(t=><span key={t} className="absolute right-0 h-px w-3 bg-fg/30" style={{bottom:t+"%"}}/>)}
      <span className="absolute inset-0 grid place-items-center text-2xl font-semibold text-white drop-shadow-md">{p.toFixed(0)}%</span></div>
    <p className="mt-3 font-medium">{name}</p><p className="text-sm text-mut">{Math.round(liters).toLocaleString()} / {Math.round(cap).toLocaleString()} L</p>{note&&<p className="text-xs text-mut">{note}</p>}</div>}
