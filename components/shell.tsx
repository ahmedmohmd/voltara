"use client";
import {Logo} from "@/components/logo";
import Link from "next/link";import {usePathname,useRouter} from "next/navigation";import {useEffect,useState} from "react";import {useTheme} from "next-themes";
import {Sun,Moon,Zap,Users,GitCompare,Factory,Activity,Cog,Gauge,Fuel,Droplets,Settings,LogOut,Menu,X,Globe} from "lucide-react";import {useMe} from "./me";
const G:[string,[string,string,any][]][]=[["Overview",[["/app","Clients",Users]]],["Station",[["/app/station","Daily data",Factory],["/app/station/analysis","Analysis",Activity]]],["Generators",[["/app/generators","Generator data",Cog],["/app/generators/analysis","Generator analysis",Gauge]]],["Diesel",[["/app/diesel","Diesel tanks",Fuel],["/app/diesel/analysis","Diesel analysis",Droplets]]],["Insights",[["/app/compare","Compare",GitCompare]]],["System",[["/app/settings","Settings",Settings]]]];
export default function Shell({children}:{children:React.ReactNode}){const {theme,setTheme}=useTheme(),p=usePathname(),r=useRouter(),{me,admin}=useMe(),[o,setO]=useState(false);
  useEffect(()=>setO(false),[p]);
  const on=(h:string)=>h==="/app"?p==="/app"||p.startsWith("/app/clients"):(h==="/app/station"||h==="/app/generators"||h==="/app/diesel")?p===h:p.startsWith(h);
  const out=async()=>{await fetch("/api/auth/logout",{method:"POST"});r.replace("/login")};
  const ib="grid size-9 place-items-center rounded-xl border border-line text-mut transition hover:border-brand hover:text-brand";
  return <div className="min-h-screen">
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-side/90 px-4 py-3 backdrop-blur md:hidden"><Link href="/"><Logo size={30} tag={false}/></Link><button aria-label="Open menu" className={ib} onClick={()=>setO(true)}><Menu size={18}/></button></header>
    {o&&<div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={()=>setO(false)}/>}
    <aside className={"fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-side transition-transform duration-300 md:translate-x-0 "+(o?"translate-x-0":"-translate-x-full")}>
      <div className="relative flex items-center justify-between px-5 pb-4 pt-6"><div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--brand),transparent_80%),transparent_75%)]"/>
        <Link href="/" className="relative"><Logo size={42}/></Link>
        <button aria-label="Close menu" className={ib+" relative md:hidden"} onClick={()=>setO(false)}><X size={16}/></button></div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3">{G.map(([t,items])=><div key={t}><p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-mut/70">{t}</p>
        {items.map(([h,l,I])=><Link key={h} href={h} className={"relative mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition "+(on(h)?"bg-brand/12 font-medium text-brand":"text-mut hover:bg-fg/5 hover:text-fg")}>
          {on(h)&&<span className="absolute -left-3 top-2 h-6 w-1 rounded-r-full bg-brand"/>}<I size={18}/>{l}</Link>)}</div>)}
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-mut transition hover:bg-fg/5 hover:text-fg"><Globe size={18}/>Website</Link></nav>
      <div className="m-3 rounded-2xl border border-line bg-gradient-to-b from-fg/[.04] to-transparent p-3"><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-lt to-brand-dk font-semibold text-white">{(me?.name||"?").slice(0,1).toUpperCase()}</span>
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{me?.name}</p><span className={"inline-block rounded-full px-2 py-0.5 text-[11px] font-medium "+(admin?"bg-brand/15 text-brand":"bg-teal/15 text-teal")}>{admin?"Admin":"Viewer"}</span></div></div>
        <div className="mt-3 flex gap-2"><button aria-label="Toggle theme" title="Light / dark" className={ib+" flex-1"} onClick={()=>setTheme(theme==="dark"?"light":"dark")}><Sun className="hidden dark:block" size={16}/><Moon className="dark:hidden" size={16}/></button>
          <button aria-label="Sign out" title="Sign out" className={ib+" flex-1 hover:!border-red-500 hover:!text-red-500"} onClick={out}><LogOut size={16}/></button></div></div></aside>
    <main className="relative mx-auto w-full max-w-6xl p-4 sm:p-6 md:ml-64 md:w-[calc(100%-16rem)] md:max-w-none md:px-10 md:py-8"><div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--brand),transparent_86%),transparent_70%)]"/><div className="mx-auto max-w-6xl">{children}</div></main></div>}
