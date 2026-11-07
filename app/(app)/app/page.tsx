"use client";
import {useMe} from "@/components/me";
import {useEffect,useState} from "react";import Link from "next/link";import {Trash2,Plus} from "lucide-react";import {Card,Btn,inp} from "@/components/ui";
export default function Home(){const {admin}=useMe();const [cs,setCs]=useState<any[]>([]),[name,setName]=useState(""),[err,setErr]=useState("");
  const load=()=>fetch("/api/clients").then(r=>r.json()).then(setCs);useEffect(()=>{load()},[]);
  const add=async()=>{const r=await fetch("/api/clients",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name})});const j=await r.json();setErr(r.ok?"":j.error);if(r.ok){setName("");load()}};
  const del=async(c:any)=>{if(confirm(`Delete ${c.name} and all its months?`)){await fetch("/api/clients/"+c.id,{method:"DELETE"});load()}};
  return <div className="space-y-6"><h1 className="text-3xl font-semibold">Clients</h1>
    {admin&&<Card><div className="flex gap-2"><input className={inp} placeholder="New client name" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/><Btn onClick={add}><Plus size={16} className="inline"/> Add</Btn></div>{err&&<p className="mt-2 text-sm text-red-500">{err}</p>}</Card>}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cs.map(c=><Card key={c.id} className="flex items-center justify-between transition hover:border-brand"><Link href={"/app/clients/"+c.id} className="flex-1 text-lg font-medium">{c.name}</Link>
      {admin&&<button aria-label="Delete client" onClick={()=>del(c)} className="text-mut hover:text-red-500"><Trash2 size={18}/></button>}</Card>)}</div>
    {!cs.length&&<p className="text-mut">No clients yet. Add your first client above.</p>}</div>}
