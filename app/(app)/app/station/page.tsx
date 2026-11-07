"use client";
import {useMe} from "@/components/me";
import {useEffect,useState} from "react";import {Trash2,Upload,Download,AlertTriangle} from "lucide-react";import {Card,Btn,Modal,inp} from "@/components/ui";import {calc,FULL} from "@/lib/station";
const p2=(n:number)=>String(n).padStart(2,"0"),t=new Date(),TODAY=`${t.getFullYear()}-${p2(t.getMonth()+1)}-${p2(t.getDate())}`;
const f0=(x:number)=>isFinite(x)?Math.round(x).toLocaleString():"–",f2=(x:number)=>isFinite(x)?x.toFixed(2):"–",pc=(x:number)=>isFinite(x)?(x*100).toFixed(1)+"%":"–";
const E0={gens:"",fuel:"",pv:"",mv:""};
export default function Station(){const {admin,settings}=useMe();const lo=settings.sfcMin??2.5,hi=settings.sfcMax??4.5,lw=(settings.lossWarn??15)/100;const [date,setDate]=useState(TODAY),[v,setV]=useState<any>(E0),[days,setDays]=useState<any[]>([]),[msg,setMsg]=useState(""),[imp,setImp]=useState(false);
  const [iy,setIy]=useState(t.getFullYear()),[im,setIm]=useState(t.getMonth()+1),[file,setFile]=useState<File|null>(null),[pre,setPre]=useState<any>(null),[err,setErr]=useState(""),[busy,setBusy]=useState(false);
  const ym=date.slice(0,7);
  const load=()=>{const [y,m]=ym.split("-").map(Number);if(!y||!m)return;fetch(`/api/station?from=${ym}-01&to=${ym}-${p2(new Date(y,m,0).getDate())}`).then(r=>r.json()).then(setDays)};
  useEffect(load,[ym]);
  useEffect(()=>{const d=days.find(x=>x.date===date);setV(d?{gens:""+d.gens,fuel:""+d.fuel,pv:""+d.pv,mv:""+d.mv}:E0)},[date,days]);
  const num=Object.fromEntries(Object.entries(v).map(([k,x]:any)=>[k,x===""?NaN:+x])) as any,c=calc(num),ok=[num.gens,num.fuel,num.pv,num.mv].every(x=>isFinite(x)&&x>=0)&&!!date;
  const warns=[ok&&c.sfc&&(c.sfc<lo||c.sfc>hi)?`SFC is outside the usual ${lo}–${hi} kWh/L. Check gens and fuel.`:"",ok&&c.loss<0?"Main meter is higher than gens + PV, so losses are negative. Check the readings.":"",ok&&c.lossPct>lw?`Losses are above ${lw*100}%. Check the main meter reading.`:""].filter(Boolean);
  const save=async()=>{const r=await fetch("/api/station",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date,...num})});const j=await r.json();setMsg(r.ok?"Saved":j.error);if(r.ok)load();setTimeout(()=>setMsg(""),2500)};
  const del=async(d:string)=>{if(confirm("Delete "+d+"?")){await fetch("/api/station?date="+d,{method:"DELETE"});load()}};
  const fd=()=>{const f=new FormData();f.set("year",""+iy);f.set("month",""+im);if(file)f.set("file",file);return f};
  const preview=async()=>{setBusy(true);setErr("");setPre(null);const r=await fetch("/api/station/import",{method:"POST",body:fd()}),j=await r.json();setBusy(false);r.ok?setPre(j):setErr(j.error)};
  const commit=async()=>{setBusy(true);const r=await fetch("/api/station",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(pre.rows)}),j=await r.json();setBusy(false);
    if(!r.ok)return setErr(j.error);setImp(false);setPre(null);setFile(null);setDate(`${iy}-${p2(im)}-01`);load()};
  const F=[["gens","Gensets production (kWh)"],["fuel","Liters consumed"],["pv","PV production (kWh)"],["mv","Main meter production (kWh)"]];
  const R=(l:string,x:string)=><div className="rounded-xl border border-line bg-bg p-3"><p className="text-xs text-mut">{l}</p><p className="text-xl font-semibold">{x}</p></div>;
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-semibold">{settings.stationName||"Abu Minqar"} station</h1><p className="text-mut">Daily meter sheet</p></div>{admin&&<Btn ghost onClick={()=>setImp(true)}><Upload size={16} className="mr-1 inline"/>Import Excel month</Btn>}</div>
    {admin&&<Card><div className="grid gap-4 md:grid-cols-5"><div><label className="text-sm text-mut">Date</label><input type="date" className={inp} value={date} onChange={e=>setDate(e.target.value)}/></div>
      {F.map(([k,l])=><div key={k}><label className="text-sm text-mut">{l}</label><input type="number" min="0" step="any" className={inp} value={v[k]} onChange={e=>setV({...v,[k]:e.target.value})}/></div>)}</div>
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">{R("Total production (kWh)",ok?f0(c.tot):"–")}{R("PV share",ok?pc(c.share):"–")}{R("SFC gensets (kWh/L)",ok?f2(c.sfc):"–")}{R("Internal losses (kWh)",ok?f0(c.loss):"–")}{R("Losses %",ok?pc(c.lossPct):"–")}</div>
      {warns.map(w=><p key={w} className="mt-3 flex items-center gap-2 text-sm text-amber-500"><AlertTriangle size={16}/>{w}</p>)}
      <div className="mt-4 flex items-center gap-3"><Btn disabled={!ok} onClick={save}>{days.some(d=>d.date===date)?"Update day":"Save day"}</Btn><span className="text-sm text-brand">{msg}</span></div></Card>}
    <Card className="overflow-x-auto"><h2 className="mb-3 font-semibold">{FULL[+ym.slice(5)-1]} {ym.slice(0,4)}</h2><table className="w-full text-sm"><thead><tr className="text-left text-mut"><th className="py-2">Date</th><th>Gens</th><th>Liters</th><th>PV</th><th>Main</th><th>Total</th><th>PV %</th><th>SFC</th><th>Loss</th><th>Loss %</th><th></th></tr></thead>
      <tbody>{days.map(d=>{const x=calc(d);return <tr key={d.date} className={"cursor-pointer border-t border-line hover:bg-brand/5 "+(d.date===date?"bg-brand/10":"")} onClick={()=>setDate(d.date)}><td className="py-2">{d.date}</td><td>{f0(d.gens)}</td><td>{f0(d.fuel)}</td><td>{f0(d.pv)}</td><td>{f0(d.mv)}</td><td>{f0(x.tot)}</td><td>{pc(x.share)}</td><td>{f2(x.sfc)}</td><td>{f0(x.loss)}</td><td>{pc(x.lossPct)}</td><td>{admin&&<button aria-label="Delete day" className="text-mut hover:text-red-500" onClick={e=>{e.stopPropagation();del(d.date)}}><Trash2 size={15}/></button>}</td></tr>})}</tbody></table>
      {!days.length&&<p className="py-4 text-mut">No days saved for this month yet.</p>}</Card>
    <Modal open={imp} onClose={()=>setImp(false)} title="Import a month from Excel"><div className="space-y-3">
      <div className="grid grid-cols-2 gap-3"><input type="number" className={inp} value={iy} onChange={e=>{setIy(+e.target.value);setPre(null)}} aria-label="Year"/><select className={inp} value={im} onChange={e=>{setIm(+e.target.value);setPre(null)}} aria-label="Month">{FULL.map((n,i)=><option key={n} value={i+1}>{n}</option>)}</select></div>
      <input type="file" accept=".xlsx,.xls" className={inp} onChange={e=>{setFile(e.target.files?.[0]||null);setPre(null)}}/>
      <p className="text-xs text-mut">First sheet, columns <b>gens, fuel, pv, mv</b>, one row per day (optional <b>day</b> column). <a className="text-brand underline" href={`/api/station/template?year=${iy}&month=${im}`}><Download size={12} className="inline"/> Download template</a></p>
      {err&&<p className="text-sm text-red-500">{err}</p>}
      {pre&&<div className="space-y-2 text-sm">{!pre.matches&&<p className="flex gap-2 rounded-lg bg-amber-500/15 p-3 text-amber-500"><AlertTriangle size={16} className="shrink-0"/>Sheet name “{pre.sheet}” is not “{pre.expected}”. Check that this is the right month before saving.</p>}
        <p>{pre.rows.length} valid days ready to save.</p>{pre.errors.slice(0,6).map((e:string)=><p key={e} className="text-red-500">{e}</p>)}{pre.errors.length>6&&<p className="text-red-500">and {pre.errors.length-6} more errors</p>}</div>}
      <div className="flex justify-end gap-2"><Btn ghost onClick={()=>setImp(false)}>Cancel</Btn>{!pre?<Btn disabled={!file||busy} onClick={preview}>{busy?"Reading…":"Preview"}</Btn>:<Btn disabled={!pre.rows.length||busy} onClick={commit}>{pre.matches?"Save":"Continue and save"}{pre.errors.length?" valid days":""}</Btn>}</div></div></Modal></div>}
