"use client";
import {createContext,useContext,useEffect,useState} from "react";import {useRouter} from "next/navigation";import {applyAccent} from "@/lib/accent";
const C=createContext<any>({me:null,settings:{},admin:false});
export const useMe=()=>useContext(C);
export function MeProvider({children}:{children:React.ReactNode}){const [me,setMe]=useState<any>(null),[settings,setSettings]=useState<any>({}),r=useRouter();
  useEffect(()=>{const a=localStorage.getItem("accent");if(a)applyAccent(a);
    fetch("/api/auth/me").then(x=>x.ok?x.json():null).then(j=>j?setMe(j):r.replace("/login"));fetch("/api/settings").then(x=>x.ok?x.json():{}).then(setSettings)},[]);
  return <C.Provider value={{me,settings,setSettings,admin:me?.role==="admin"}}>{me?children:<div className="grid min-h-screen place-items-center text-mut">Loading…</div>}</C.Provider>}
