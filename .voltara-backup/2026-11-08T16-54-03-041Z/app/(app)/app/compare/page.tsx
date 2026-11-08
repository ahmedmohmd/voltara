"use client";
import {useEffect,useState} from "react";import {ResponsiveContainer,LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid,Legend} from "recharts";
import {Card} from "@/components/ui";import {P,E,MN} from "@/lib/fmt";
const COL=["#f97316","#3b82f6","#22c55e","#a855f7","#eab308","#ec4899"];
export default function Compare(){const [all,setAll]=useState<any[]>([]),[sel,setSel]=useState<number[]>([]);
  useEffect(()=>{fetch("/api/months").then(r=>r.json()).then(setAll)},[]);
  const S=all.filter(x=>sel.includes(x.id)),L=(x:any)=>`${x.client} ${MN[x.month-1]} ${x.year}`;
  const data=Array.from({length:24},(_,h)=>Object.fromEntries([["h",h+":00"],...S.map(x=>[L(x),x.analysis.hourly.avg[h]/1e6])]));
  const toggle=(id:number)=>setSel(s=>s.includes(id)?s.filter(i=>i!==id):s.length<6?[...s,id]:s);
  return <div className="space-y-6"><h1 className="text-3xl font-semibold">Compare</h1>
    <Card><p className="mb-3 text-sm text-mut">Pick up to 6 saved months. Mix months, years or clients.</p><div className="flex flex-wrap gap-2">{all.map(x=><button key={x.id} onClick={()=>toggle(x.id)} className={"rounded-full border px-3 py-1.5 text-sm "+(sel.includes(x.id)?"border-brand bg-brand text-white":"border-line hover:border-brand")}>{L(x)}</button>)}</div></Card>
    {!!S.length&&<><Card><h2 className="mb-3 font-semibold">Average daily load curve (MW)</h2><div className="h-80"><ResponsiveContainer><LineChart data={data}><CartesianGrid stroke="#a1a1aa" strokeOpacity={.2}/><XAxis dataKey="h" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/><Tooltip/><Legend/>
      {S.map((x,i)=><Line key={x.id} dataKey={L(x)} stroke={COL[i]} strokeWidth={2.5} dot={false}/>)}</LineChart></ResponsiveContainer></div></Card>
      <Card className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-mut"><th className="py-2">Profile</th><th>Max demand</th><th>Energy</th><th>Avg demand</th><th>Load factor</th><th>PF</th></tr></thead>
      <tbody>{S.map((x,i)=>{const k=x.analysis.k;return <tr key={x.id} className="border-t border-line"><td className="py-2 font-medium"><span className="mr-2 inline-block size-2.5 rounded-full" style={{background:COL[i]}}/>{L(x)}</td><td>{P(k.maxW)}</td><td>{E(k.energyWh)}</td><td>{P(k.avgW)}</td><td>{(k.lf*100).toFixed(1)}%</td><td>{k.pf.toFixed(2)}</td></tr>})}</tbody></table></Card></>}</div>}
