"use client";
import {useRef} from "react";
const T="rotateY(-14deg) rotateX(8deg)";
export default function Hero3D(){const r=useRef<HTMLDivElement>(null);
  const mv=(e:React.PointerEvent)=>{const b=e.currentTarget.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;if(r.current)r.current.style.transform=`rotateY(${x*20-8}deg) rotateX(${-y*16+6}deg)`};
  const z=(n:number)=>({transform:`translateZ(${n}px)`});
  return <div className="relative mx-auto w-full max-w-xl [perspective:1400px]" onPointerMove={mv} onPointerLeave={()=>{if(r.current)r.current.style.transform=T}}>
    <div ref={r} className="relative transition-transform duration-300 ease-out [transform-style:preserve-3d]" style={{transform:T}}>
      <div className="rounded-3xl border border-line bg-card/90 p-5 shadow-2xl shadow-orange-500/10 backdrop-blur" style={z(0)}>
        <div className="mb-3 flex items-center justify-between"><span className="text-sm font-medium">Average daily load</span><span className="rounded-full bg-brand/15 px-2.5 py-1 text-xs text-brand">Oct 2026</span></div>
        <svg viewBox="0 0 400 160" className="w-full"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f97316" stopOpacity=".35"/><stop offset="1" stopColor="#f97316" stopOpacity="0"/></linearGradient></defs>
          <path d="M0 140 C60 140 70 138 100 120 C130 60 150 30 200 28 C250 26 270 70 310 110 C340 138 360 140 400 140 L400 160 L0 160Z" fill="url(#g)"/>
          <path className="draw" d="M0 140 C60 140 70 138 100 120 C130 60 150 30 200 28 C250 26 270 70 310 110 C340 138 360 140 400 140" fill="none" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round"/></svg>
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-mut"><div>Peak<b className="block text-base text-fg">2.34 MW</b></div><div>Energy<b className="block text-base text-fg">522 MWh</b></div><div>PF<b className="block text-base text-fg">0.96</b></div></div></div>
      <div className="flt absolute -right-4 -top-6 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white shadow-xl shadow-orange-500/40 sm:-right-8" style={z(80)}><p className="text-xs text-white/80">Load factor</p><p className="text-2xl font-semibold">71%</p></div>
      <div className="flt absolute -bottom-6 -left-4 rounded-2xl border border-line bg-card p-4 shadow-xl sm:-left-8" style={{...z(100),animationDelay:"1.2s"}}><p className="text-xs text-mut">Clients</p><p className="text-2xl font-semibold">6 active</p></div>
      <div className="absolute -right-2 bottom-10 hidden sm:block" style={z(120)}><div className="cube"><i/><i/><i/><i/><i/><i/></div></div></div></div>}
