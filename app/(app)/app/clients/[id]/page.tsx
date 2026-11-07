"use client";
import {useMe} from "@/components/me";
import {useEffect,useState} from "react";import {useParams} from "next/navigation";import {Plus,Trash2} from "lucide-react";
import {ResponsiveContainer,AreaChart,Area,LineChart,Line,BarChart,Bar,XAxis,YAxis,Tooltip,CartesianGrid,Legend} from "recharts";
import {Card,Btn,Modal,inp} from "@/components/ui";import {P,E,MN} from "@/lib/fmt";
const O="var(--brand)",G="#a1a1aa";
const Ch=({t,children}:any)=><Card><h2 className="mb-3 font-semibold">{t}</h2><div className="h-64"><ResponsiveContainer>{children}</ResponsiveContainer></div></Card>;
export default function Client(){const {admin}=useMe();const {id}=useParams<{id:string}>();const [ms,setMs]=useState<any[]>([]),[sel,setSel]=useState(0),[name,setName]=useState(""),[open,setOpen]=useState(false),[err,setErr]=useState(""),[busy,setBusy]=useState(false);
  const now=new Date(),[y,setY]=useState(now.getFullYear()),[m,setM]=useState(now.getMonth()+1);
  const load=()=>fetch("/api/months?clientId="+id).then(r=>r.json()).then(setMs);
  useEffect(()=>{load();fetch("/api/clients").then(r=>r.json()).then((l:any[])=>setName(l.find(c=>c.id==+id)?.name||""))},[id]);
  const save=async(e:any)=>{e.preventDefault();setBusy(true);setErr("");const f=new FormData(e.target);f.set("clientId",id);const r=await fetch("/api/months",{method:"POST",body:f});const j=await r.json();setBusy(false);
    if(!r.ok)return setErr(j.error);setOpen(false);setSel(0);load()};
  const cur=ms[sel],a=cur?.analysis,k=a?.k;
  const kp=k?[["Max demand",P(k.maxW),k.maxT],["Total energy",E(k.energyWh),k.n+" readings"],["Average demand",P(k.avgW),""],["Load factor",(k.lf*100).toFixed(1)+"%","Avg ÷ max"],
    ["Lowest load",P(k.minW),""],["Power factor",k.pf.toFixed(2),"Overall"],["Reactive energy",(k.varh/1e3).toFixed(0)+" kvarh",""],["Flags / zeros",k.flags+" / "+k.zero,"Status records"]]:[];
  const hr=a?a.hourly.avg.map((v:number,i:number)=>({h:i+":00",avg:v/1e6,max:a.hourly.max[i]/1e6,pf:a.hourly.pf[i]})):[];
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl font-semibold">{name}</h1>{admin&&<Btn onClick={()=>setOpen(true)}><Plus size={16} className="inline"/> Add month</Btn>}</div>
    {!ms.length&&<Card><p className="text-mut">No months yet. Click Add month to upload the first load profile.</p></Card>}
    {!!ms.length&&<div className="flex flex-wrap items-center gap-2">{ms.map((x,i)=><button key={x.id} onClick={()=>setSel(i)} className={"rounded-full border px-4 py-1.5 text-sm "+(i===sel?"border-brand bg-brand text-white":"border-line hover:border-brand")}>{MN[x.month-1]} {x.year}</button>)}
      {admin&&<button aria-label="Delete month" className="ml-2 text-mut hover:text-red-500" onClick={async()=>{if(confirm("Delete this month?")){await fetch("/api/months?id="+cur.id,{method:"DELETE"});setSel(0);load()}}}><Trash2 size={18}/></button>}</div>}
    {a&&<><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{kp.map(([l,v,s],i)=><Card key={l} className={(i===0?"col-span-2 !border-brand !bg-gradient-to-br from-brand to-brand-dk text-white shadow-lg shadow-brand/20":i>5?"lg:col-span-2":"")}><p className={"text-sm "+(i===0?"text-white/80":"text-mut")}>{l}</p><p className={"font-semibold "+(i===0?"text-4xl":"text-2xl")}>{v}</p><p className={"text-xs "+(i===0?"text-white/80":"text-mut")}>{s}</p></Card>)}</div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Ch t="Average daily load curve (MW)"><AreaChart data={hr}><CartesianGrid stroke={G} strokeOpacity={.2}/><XAxis dataKey="h" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/><Tooltip/><Legend/><Area dataKey="avg" name="Average" stroke={O} fill={O} fillOpacity={.25}/><Area dataKey="max" name="Highest" stroke={G} fill="none" strokeDasharray="4 4"/></AreaChart></Ch>
        <Ch t="Daily energy (MWh) and peak"><BarChart data={a.daily.map((d:any)=>({d:d.d,e:d.e/1e6,pk:d.pk/1e6}))}><CartesianGrid stroke={G} strokeOpacity={.2}/><XAxis dataKey="d" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/><Tooltip/><Legend/><Bar dataKey="e" name="Energy MWh" fill={O} radius={[3,3,0,0]}/><Bar dataKey="pk" name="Peak MW" fill={G}/></BarChart></Ch>
        <Ch t="Load duration curve (MW)"><AreaChart data={a.ldc.map((v:number,i:number)=>({p:i+"%",v:v/1e6}))}><CartesianGrid stroke={G} strokeOpacity={.2}/><XAxis dataKey="p" interval={10} tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/><Tooltip/><Area dataKey="v" name="Demand" stroke={O} fill={O} fillOpacity={.25}/></AreaChart></Ch>
        <Ch t="Power factor by hour"><LineChart data={hr}><CartesianGrid stroke={G} strokeOpacity={.2}/><XAxis dataKey="h" tick={{fontSize:11}}/><YAxis domain={[0,1]} tick={{fontSize:11}}/><Tooltip/><Line dataKey="pf" name="PF" stroke={O} strokeWidth={2} dot={false}/></LineChart></Ch>
      </div></>}
    <Modal open={open} onClose={()=>setOpen(false)} title="Add month load profile"><form onSubmit={save} className="space-y-3">
      <div className="grid grid-cols-2 gap-3"><input name="year" type="number" className={inp} value={y} onChange={e=>setY(+e.target.value)} aria-label="Year"/>
        <select name="month" className={inp} value={m} onChange={e=>setM(+e.target.value)} aria-label="Month">{MN.map((n,i)=><option key={n} value={i+1}>{n}</option>)}</select></div>
      <input name="files" type="file" multiple accept=".xlsx,.xls" required className={inp}/><p className="text-xs text-mut">You can select several files (for example Part 1 and Part 2). Uploading an existing month replaces it.</p>
      {err&&<p className="text-sm text-red-500">{err}</p>}<div className="flex justify-end gap-2"><Btn type="button" ghost onClick={()=>setOpen(false)}>Cancel</Btn><Btn disabled={busy}>{busy?"Analyzing…":"Save"}</Btn></div></form></Modal></div>}
