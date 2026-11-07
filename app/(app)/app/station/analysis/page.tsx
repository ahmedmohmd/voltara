"use client";
import {useMe} from "@/components/me";
import {useEffect,useMemo,useState} from "react";
import {ResponsiveContainer,ComposedChart,Bar,Line,LineChart,AreaChart,Area,BarChart,PieChart,Pie,Cell,ScatterChart,Scatter,XAxis,YAxis,Tooltip,CartesianGrid,Legend,ReferenceLine} from "recharts";
import {Card,inp} from "@/components/ui";import Kpi from "@/components/kpi";import {calc,FULL} from "@/lib/station";
const O="var(--brand)",G="#a1a1aa",B="#38bdf8",R="#fb7185",GR="#34d399",ax={tick:{fontSize:11}};
const Ch=({t,sub,children}:any)=><Card><h2 className="font-semibold">{t}</h2><p className="mb-2 text-sm text-mut">{sub}</p><div className="h-64"><ResponsiveContainer>{children}</ResponsiveContainer></div></Card>;
const grid=<CartesianGrid stroke={G} strokeOpacity={.2}/>;
const avg=(a:number[])=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0,sd=(a:number[])=>{const m=avg(a);return Math.sqrt(avg(a.map(x=>(x-m)**2)))};
const agg=(a:any[])=>{const s={gens:0,fuel:0,pv:0,mv:0};a.forEach(r=>{s.gens+=r.gens;s.fuel+=r.fuel;s.pv+=r.pv;s.mv+=r.mv});return{...s,...calc(s)}};
const MWh=(x:number)=>(x/1000).toFixed(1)+" MWh",P=(x:number)=>(x*100).toFixed(1)+"%";
export default function Analysis(){const {settings}=useMe();const now=new Date(),[y,setY]=useState(now.getFullYear()),[m,setM]=useState(now.getMonth()+1),[all,setAll]=useState<any[]>([]),[cl,setCl]=useState<any[]>([]);
  useEffect(()=>{fetch(`/api/station?from=${y}-01-01&to=${y}-12-31`).then(r=>r.json()).then(setAll);fetch("/api/months").then(r=>r.json()).then(setCl)},[y]);
  const rows=useMemo(()=>all.map(d=>({...d,...calc(d),mo:+d.date.slice(5,7),day:+d.date.slice(8)})),[all]);
  const D=m?rows.filter(r=>r.mo===m):rows,T=agg(D);
  const S:any[]=m?D.map(r=>({l:r.day,...r})):[...Array(12)].map((_,i)=>{const a=rows.filter(r=>r.mo===i+1);return a.length?{l:FULL[i].slice(0,3),...agg(a)}:null}).filter(Boolean);
  const best=[...D].sort((a,b)=>b.tot-a.tot)[0],worst=[...D].sort((a,b)=>a.tot-b.tot)[0];
  const lp=D.map(r=>r.lossPct),lm=avg(lp),ls=sd(lp),odd=D.filter(r=>r.loss<0||(ls>0&&Math.abs(r.lossPct-lm)>2*ls));
  const reg=(()=>{if(D.length<5)return null;const mx=avg(D.map(r=>r.tot)),my=avg(D.map(r=>r.loss));let a=0,b=0;D.forEach(r=>{a+=(r.tot-mx)*(r.loss-my);b+=(r.tot-mx)**2});if(!b)return null;const k=a/b;return{k,c:my-k*mx}})();
  const cm=m?cl.filter(c=>c.year===y&&c.month===m):[],cKwh=cm.reduce((a,c)=>a+c.analysis.k.energyWh/1000,0);
  const curve=[...Array(24)].map((_,h)=>({h:h+":00",mw:cm.reduce((a,c)=>a+c.analysis.hourly.avg[h],0)/1e6}));
  const pk=curve.reduce((a,c)=>c.mw>a.mw?c:a,curve[0]);
  const prev=m>1?agg(rows.filter(r=>r.mo===m-1)):null;
  const eq=T.sfc?T.loss/T.sfc:0,maxT=Math.max(1,...D.map(r=>r.tot));
  const ins=D.length?[
    `Station produced ${MWh(T.tot)} (${MWh(T.gens)} gensets and ${MWh(T.pv)} PV). PV share is ${P(T.share)}.`,
    `Average SFC of gensets is ${T.sfc.toFixed(2)} kWh/L from ${Math.round(T.fuel).toLocaleString()} liters.`,
    `Internal losses are ${MWh(T.loss)} (${P(T.lossPct)} of production). This equals about ${Math.round(eq).toLocaleString()} liters of diesel.`,
    reg?(reg.c>0?`Losses have a fixed part of about ${Math.round(reg.c).toLocaleString()} kWh per day plus ${P(reg.k)} of each kWh produced.`:`Losses are mostly proportional to production, about ${P(reg.k)} of each kWh produced, with no clear fixed part.`):"",
    odd.length?`${odd.length} unusual loss day${odd.length>1?"s":""}: ${odd.slice(0,5).map(r=>r.date.slice(5)).join(", ")}. Check meter readings on these days.`:"No unusual loss days found.",
    best&&worst&&m?`Best day: ${best.date.slice(5)} (${MWh(best.tot)}). Lowest day: ${worst.date.slice(5)} (${MWh(worst.tot)}).`:"",
    prev&&prev.tot&&m?`Compared with ${FULL[m-2]}: production ${((T.tot/prev.tot-1)*100).toFixed(1)}%, SFC ${(T.sfc-prev.sfc>=0?"+":"")+(T.sfc-prev.sfc).toFixed(2)}, losses ${((T.lossPct-prev.lossPct)*100>=0?"+":"")+((T.lossPct-prev.lossPct)*100).toFixed(1)} points.`:"",
    m&&cm.length&&T.mv?`Client load profiles uploaded for this month cover ${MWh(cKwh)}, which is ${P(cKwh/T.mv)} of the main meter. Their combined peak hour is ${pk.h}.`:m?"No client load profiles uploaded for this month, so the link to load profiles is not available.":""
  ].filter(Boolean):[];
  const kp=[["Total production",T.tot,(v:number)=>MWh(v),"Gensets + PV"],["Gensets",T.gens,MWh,""],["PV",T.pv,MWh,""],["PV share",T.share*100,(v:number)=>v.toFixed(1)+"%","PV ÷ total"],
    ["SFC gensets",T.sfc,(v:number)=>v.toFixed(2)+" kWh/L","Gens ÷ liters"],["Liters consumed",T.fuel,(v:number)=>Math.round(v).toLocaleString()+" L",""],["Main meter",T.mv,MWh,""],["Internal losses",T.loss,MWh,P(T.lossPct)+" of production"]];
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-3xl font-semibold">Station analysis</h1><p className="text-mut">{settings.stationName||"Abu Minqar"}</p></div>
    <div className="flex gap-2"><input type="number" className={inp+" !w-28"} value={y} onChange={e=>setY(+e.target.value)} aria-label="Year"/><select className={inp+" !w-44"} value={m} onChange={e=>setM(+e.target.value)} aria-label="Month"><option value={0}>Whole year</option>{FULL.map((n,i)=><option key={n} value={i+1}>{n}</option>)}</select></div></div>
    {!D.length?<Card><p className="text-mut">No station data for this period. Add days in Station data or import an Excel month.</p></Card>:<>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{kp.map(([l,val,fmt,s]:any,i)=><Kpi key={l+y+m} i={i} hero={i===0} l={l} val={val} fmt={fmt} s={s}/>)}</div>
    <Card><h2 className="mb-1 font-semibold">What the data says</h2><ul>{ins.map(x=><li key={x} className="border-t border-line py-2 text-sm first:border-0">{x}</li>)}</ul></Card>
    <div className="grid gap-4 lg:grid-cols-2">
      <Ch t="Production vs main meter (kWh)" sub="Bars are gensets + PV. The line is the main meter."><ComposedChart data={S}>{grid}<XAxis dataKey="l" {...ax}/><YAxis {...ax}/><Tooltip/><Legend/><Bar dataKey="gens" name="Gensets" stackId="a" fill={O}/><Bar dataKey="pv" name="PV" stackId="a" fill={B}/><Line dataKey="mv" name="Main meter" stroke={GR} strokeWidth={2.5} dot={false}/></ComposedChart></Ch>
      <Ch t="SFC of gensets (kWh/L)" sub="Dashed line is the average."><LineChart data={S}>{grid}<XAxis dataKey="l" {...ax}/><YAxis domain={["auto","auto"]} {...ax}/><Tooltip/><ReferenceLine y={T.sfc} stroke={G} strokeDasharray="5 5"/><Line dataKey="sfc" name="SFC" stroke={O} strokeWidth={2.5} dot={{r:2}}/></LineChart></Ch>
      <Ch t="Internal losses" sub="Bars: kWh lost. Line: % of production."><ComposedChart data={S}>{grid}<XAxis dataKey="l" {...ax}/><YAxis yAxisId="a" {...ax}/><YAxis yAxisId="b" orientation="right" tickFormatter={(v:number)=>(v*100).toFixed(0)+"%"} {...ax}/><Tooltip/><Legend/><Bar yAxisId="a" dataKey="loss" name="Loss kWh" fill={R} fillOpacity={.8} radius={[3,3,0,0]}/><Line yAxisId="b" dataKey="lossPct" name="Loss %" stroke={O} strokeWidth={2.5} dot={false}/></ComposedChart></Ch>
      <Ch t="PV share" sub="Share of PV in total production."><AreaChart data={S}>{grid}<XAxis dataKey="l" {...ax}/><YAxis tickFormatter={(v:number)=>(v*100).toFixed(0)+"%"} {...ax}/><Tooltip formatter={(v:any)=>P(+v)}/><Area dataKey="share" name="PV share" stroke={B} fill={B} fillOpacity={.25}/></AreaChart></Ch>
      <Ch t="Liters consumed" sub="Diesel used by gensets."><BarChart data={S}>{grid}<XAxis dataKey="l" {...ax}/><YAxis {...ax}/><Tooltip/><Bar dataKey="fuel" name="Liters" fill={O} radius={[3,3,0,0]}/></BarChart></Ch>
      <Ch t="Energy mix" sub="Where the energy goes."><PieChart><Tooltip formatter={(v:any)=>MWh(+v)}/><Legend/><Pie data={[{n:"Gensets",v:T.gens},{n:"PV",v:T.pv}]} dataKey="v" nameKey="n" innerRadius={55} outerRadius={90} paddingAngle={3}><Cell fill={O}/><Cell fill={B}/></Pie></PieChart></Ch>
      <Ch t="SFC vs station load" sub="Each dot is a day. X is average load (MW) from the main meter."><ScatterChart>{grid}<XAxis type="number" dataKey="x" name="MW" domain={["auto","auto"]} {...ax}/><YAxis type="number" dataKey="y" name="SFC" domain={["auto","auto"]} {...ax}/><Tooltip/><Scatter data={D.filter(r=>r.sfc>0).map(r=>({x:r.mv/24000,y:r.sfc}))} fill={O}/></ScatterChart></Ch>
      <Ch t="Losses vs production" sub="Each dot is a day. Shows if losses grow with production."><ScatterChart>{grid}<XAxis type="number" dataKey="x" name="Production kWh" domain={["auto","auto"]} {...ax}/><YAxis type="number" dataKey="y" name="Loss kWh" {...ax}/><Tooltip/><Scatter data={D.map(r=>({x:r.tot,y:r.loss}))} fill={R}/></ScatterChart></Ch>
    </div>
    {m>0&&<Card><h2 className="font-semibold">Daily production calendar</h2><p className="mb-3 text-sm text-mut">Darker orange means higher production. Red outline means unusual losses.</p>
      <div className="grid max-w-xl grid-cols-7 gap-1.5 sm:gap-2">{D.map((r,i)=><div key={r.date} title={`${r.date}: ${Math.round(r.tot).toLocaleString()} kWh`} style={{background:`rgba(249,115,22,${.12+.88*r.tot/maxT})`,animation:`rise .5s ${i*.015}s both`}} className={"grid aspect-square place-items-center rounded-lg text-xs font-medium "+(odd.includes(r)?"ring-2 ring-red-500":"")}>{r.day}</div>)}</div></Card>}
    {m>0&&<Card><h2 className="font-semibold">Link to client load profiles</h2>{cm.length?<><p className="mb-2 text-sm text-mut">Combined average daily curve of {cm.map(c=>c.client).join(", ")} (MW). Clients cover {P(cKwh/(T.mv||1))} of the main meter.</p>
      <div className="h-60"><ResponsiveContainer><AreaChart data={curve}>{grid}<XAxis dataKey="h" {...ax}/><YAxis {...ax}/><Tooltip/><Area dataKey="mw" name="MW" stroke={O} fill={O} fillOpacity={.25}/></AreaChart></ResponsiveContainer></div></>:<p className="text-sm text-mut">No client load profiles uploaded for this month.</p>}</Card>}
    </>}</div>}
