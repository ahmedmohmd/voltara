import {NextRequest,NextResponse} from "next/server";import * as XLSX from "xlsx";import {FULL} from "@/lib/station";import {admin} from "@/lib/auth";
export async function POST(r:NextRequest){const g=await admin();if(g)return g;
  try{const f=await r.formData(),file=f.get("file") as File,year=+(f.get("year") as string),month=+(f.get("month") as string);if(!file)throw new Error("Choose a file");
    const wb=XLSX.read(Buffer.from(await file.arrayBuffer()),{type:"buffer"}),sheet=wb.SheetNames[0],rows:any[][]=XLSX.utils.sheet_to_json(wb.Sheets[sheet],{header:1,defval:null,raw:true});
    const h1=rows[0]||[],h2=rows[1]||[],cols:any[]=[],errors:string[]=[];let cur="",dayCol=-1;
    for(let c=0;c<Math.max(h1.length,h2.length);c++){const a=h1[c]!=null?String(h1[c]).trim():"",b=h2[c]!=null?String(h2[c]).trim().toLowerCase():"";
      if(a)cur=a;if(a.toLowerCase()==="day"||b==="day"){dayCol=c;cur="";continue}
      if(["w_hours","energy","fuel"].includes(b)&&cur)cols.push({c,gen:cur,f:b})}
    if(dayCol<0)dayCol=0;const gens=[...new Set(cols.map(x=>x.gen))];
    if(!gens.length)throw new Error("No generators found. Row 1 needs merged names (gen_1, gen_2...) and row 2 needs w_hours, energy, fuel.");
    for(const gname of gens){const fs=cols.filter(x=>x.gen===gname).map(x=>x.f);for(const k of ["w_hours","energy","fuel"]){const n=fs.filter(x=>x===k).length;if(n!==1)errors.push(`${gname}: ${n?"duplicate":"missing"} column ${k}`)}}
    const dim=new Date(year,month,0).getDate(),out:any[]=[];
    rows.slice(2).forEach((row,i)=>{if(cols.every(x=>row[x.c]==null||row[x.c]===""))return;const day=row[dayCol]!=null&&row[dayCol]!==""?+row[dayCol]:i+1;
      if(!(day>=1&&day<=dim)){errors.push(`Row ${i+3}: day ${day} is not in ${FULL[month-1]} ${year}`);return}
      const date=`${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
      for(const gname of gens){const v:any={};let bad=false;for(const k of ["w_hours","energy","fuel"]){const cc=cols.find(x=>x.gen===gname&&x.f===k);const raw=cc?row[cc.c]:null;const n=raw==null||raw===""?0:Number(raw);
        if(!isFinite(n)||n<0){errors.push(`Day ${day} ${gname}: "${k}" is not a valid number`);bad=true}v[k]=n}
        if(!bad&&v.w_hours>24){errors.push(`Day ${day} ${gname}: w_hours is above 24`);bad=true}if(!bad)out.push({date,gen:gname,hours:v.w_hours,energy:v.energy,fuel:v.fuel})}});
    if(!out.length&&!errors.length)errors.push("No data rows found.");
    return NextResponse.json({sheet,expected:FULL[month-1],matches:sheet.trim().toLowerCase()===FULL[month-1].toLowerCase(),gens,rows:out,errors,days:new Set(out.map(x=>x.date)).size})}
  catch(e:any){return NextResponse.json({error:e.message},{status:400})}}
