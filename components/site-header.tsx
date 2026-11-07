"use client";
import Link from "next/link";import {usePathname} from "next/navigation";import {useEffect,useState} from "react";import {useTheme} from "next-themes";import {Sun,Moon,Zap,Menu,X} from "lucide-react";
const L=[["/","Home"],["/about","About"],["/contact","Contact"]];
export default function SiteHeader(){const p=usePathname(),[s,setS]=useState(false),[o,setO]=useState(false),{theme,setTheme}=useTheme();
  useEffect(()=>{const f=()=>setS(scrollY>16);f();addEventListener("scroll",f,{passive:true});return()=>removeEventListener("scroll",f)},[]);
  const lk=(h:string)=>"relative rounded-full px-4 py-2 text-sm transition "+(p===h?"bg-brand/15 text-brand":"text-mut hover:text-fg");
  return <header className={"hdr-in fixed inset-x-0 top-0 z-50 transition-all duration-300 "+(s?"py-2":"py-4")}><div className={"mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-300 "+(s?"mx-3 rounded-full border border-line bg-card/70 py-2 shadow-lg backdrop-blur-xl sm:mx-auto":"")}>
    <Link href="/" className="flex items-center gap-2 font-semibold"><span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30"><Zap size={18}/></span>Load Manager</Link>
    <nav className="hidden items-center gap-1 md:flex">{L.map(([h,l])=><Link key={h} href={h} className={lk(h)}>{l}</Link>)}</nav>
    <div className="flex items-center gap-2"><button aria-label="Toggle theme" className="rounded-full border border-line p-2 text-mut hover:text-brand" onClick={()=>setTheme(theme==="dark"?"light":"dark")}><Sun className="hidden dark:block" size={16}/><Moon className="dark:hidden" size={16}/></button>
      <Link href="/app" className="hidden rounded-full bg-brand px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition hover:scale-105 sm:block">Open app</Link>
      <button aria-label="Menu" className="rounded-full border border-line p-2 md:hidden" onClick={()=>setO(!o)}>{o?<X size={16}/>:<Menu size={16}/>}</button></div></div>
    {o&&<div className="mx-3 mt-2 space-y-1 rounded-2xl border border-line bg-card/95 p-3 backdrop-blur-xl md:hidden">{[...L,["/app","Open app"]].map(([h,l])=><Link key={h} href={h} onClick={()=>setO(false)} className="block rounded-xl px-4 py-3 hover:bg-brand/10">{l}</Link>)}</div>}</header>}
