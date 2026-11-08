import {useId} from "react";
const BOLT="M66 26 L39 66 H58 L51 96 L81 52 H62 L73 26 Z",HEX="M60 12 L101.6 36 V84 L60 108 L18.4 84 V36 Z";
export function Mark({size=36,white=false}:{size?:number;white?:boolean}){const u=useId().replace(/:/g,""),f=white?"#fff":`url(#g${u})`;
  return <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" className="shrink-0 drop-shadow-[0_6px_14px_color-mix(in_oklab,var(--brand),transparent_65%)]"><defs>
    <linearGradient id={"g"+u} x1="14" y1="8" x2="106" y2="112" gradientUnits="userSpaceOnUse"><stop offset="0" style={{stopColor:"var(--brand-lt)"}}/><stop offset=".5" style={{stopColor:"var(--brand)"}}/><stop offset="1" style={{stopColor:"var(--brand-dk)"}}/></linearGradient>
    <mask id={"m"+u}><rect width="120" height="120" fill="#fff"/><path d={BOLT} fill="#000" stroke="#000" strokeWidth="2" strokeLinejoin="round"/></mask></defs>
    <g mask={`url(#m${u})`}><path d={HEX} fill={f} stroke={f} strokeWidth="12" strokeLinejoin="round"/></g></svg>}
export function Logo({size=36,tag=true,white=false,className=""}:{size?:number;tag?:boolean;white?:boolean;className?:string}){
  return <span className={"inline-flex items-center gap-3 "+className}><Mark size={size} white={white}/><span className="leading-none"><b className="block font-semibold tracking-[0.16em]">VOLTARA</b>{tag&&<span className={"mt-1.5 block text-[9px] font-medium tracking-[0.32em] "+(white?"text-white/70":"text-mut")}>ENERGY ANALYTICS</span>}</span></span>}
