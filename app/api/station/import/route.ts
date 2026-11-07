import {admin} from "@/lib/auth";
import {NextRequest,NextResponse} from "next/server";import * as XLSX from "xlsx";import {FULL} from "@/lib/station";
export async function POST(r:NextRequest){const g=await admin();if(g)return g;try{const f=await r.formData(),file=f.get("file") as File,year=+(f.get("year") as string),month=+(f.get("month") as string);
  if(!file)throw new Error("Choose a file");
  const wb=XLSX.read(Buffer.from(await file.arrayBuffer()),{type:"buffer"}),sheet=wb.SheetNames[0];
  const raw:any[]=XLSX.utils.sheet_to_json(wb.Sheets[sheet],{defval:null}),dim=new Date(year,month,0).getDate(),rows:any[]=[],errors:string[]=[];
  raw.forEach((o,i)=>{const r:any=Object.fromEntries(Object.entries(o).map(([k,v])=>[k.trim().toLowerCase(),v]));
    if(["gens","fuel","pv","mv"].every(k=>r[k]==null||r[k]===""))return;
    const day=r.day!=null&&r.day!==""?+r.day:i+1;
    if(!(day>=1&&day<=dim)){errors.push(`Row ${i+2}: day ${day} is not in ${FULL[month-1]} ${year}`);return}
    const v:any={};for(const k of ["gens","fuel","pv","mv"]){const x=Number(r[k]);if(r[k]==null||r[k]===""||!isFinite(x)||x<0){errors.push(`Day ${day}: "${k}" is missing or not a valid number`);return}v[k]=x}
    rows.push({date:`${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`,...v})});
  if(!raw.length||(!rows.length&&!errors.length))errors.push("No data rows found. Columns must be named gens, fuel, pv, mv.");
  return NextResponse.json({sheet,expected:FULL[month-1],matches:sheet.trim().toLowerCase()===FULL[month-1].toLowerCase(),rows,errors})}
  catch(e:any){return NextResponse.json({error:e.message},{status:400})}}
