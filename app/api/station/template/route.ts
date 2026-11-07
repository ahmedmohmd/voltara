import {NextRequest} from "next/server";import * as XLSX from "xlsx";import {FULL} from "@/lib/station";
export async function GET(r:NextRequest){const s=r.nextUrl.searchParams,y=+(s.get("year")||2026),m=+(s.get("month")||1),dim=new Date(y,m,0).getDate();
  const ws=XLSX.utils.json_to_sheet(Array.from({length:dim},()=>({gens:null,fuel:null,pv:null,mv:null})),{header:["gens","fuel","pv","mv"]}),wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,FULL[m-1]);const b=XLSX.write(wb,{type:"buffer",bookType:"xlsx"});
  return new Response(b,{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":`attachment; filename="station-${FULL[m-1]}-${y}.xlsx"`}})}
