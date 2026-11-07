import {NextRequest} from "next/server";import * as XLSX from "xlsx";import {FULL} from "@/lib/station";
export async function GET(r:NextRequest){const s=r.nextUrl.searchParams,y=+(s.get("year")||2026),m=+(s.get("month")||1),n=Math.min(30,Math.max(1,+(s.get("gens")||6))),dim=new Date(y,m,0).getDate();
  const a:any[][]=[["day"],[null]],mg:any[]=[{s:{r:0,c:0},e:{r:1,c:0}}];
  for(let g=0;g<n;g++){const c=1+g*3;a[0].push(`gen_${g+1}`,null,null);a[1].push("w_hours","energy","fuel");mg.push({s:{r:0,c},e:{r:0,c:c+2}})}
  for(let d=1;d<=dim;d++)a.push([d]);const ws=XLSX.utils.aoa_to_sheet(a);ws["!merges"]=mg;const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,FULL[m-1]);
  return new Response(XLSX.write(wb,{type:"buffer",bookType:"xlsx"}),{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":`attachment; filename="generators-${FULL[m-1]}-${y}.xlsx"`}})}
