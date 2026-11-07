import {admin} from "@/lib/auth";
import {NextRequest,NextResponse} from "next/server";import {db} from "@/db";import {stationDays} from "@/db/schema";import {and,gte,lte,eq,sql} from "drizzle-orm";
export async function GET(r:NextRequest){const s=r.nextUrl.searchParams,c:any[]=[];
  if(s.get("from"))c.push(gte(stationDays.date,s.get("from")!));if(s.get("to"))c.push(lte(stationDays.date,s.get("to")!));
  return NextResponse.json(await db.select().from(stationDays).where(c.length?and(...c):undefined).orderBy(stationDays.date))}
export async function POST(r:NextRequest){const g=await admin();if(g)return g;try{const b=await r.json(),arr=Array.isArray(b)?b:[b];
  const v=arr.map((x:any)=>{const o={date:String(x.date),gens:+x.gens,fuel:+x.fuel,pv:+x.pv,mv:+x.mv};
    if(!/^\d{4}-\d{2}-\d{2}$/.test(o.date)||[o.gens,o.fuel,o.pv,o.mv].some(n=>!isFinite(n)||n<0))throw new Error("Invalid data for "+x.date);return o});
  if(!v.length)throw new Error("Nothing to save");
  await db.insert(stationDays).values(v).onConflictDoUpdate({target:stationDays.date,set:{gens:sql`excluded.gens`,fuel:sql`excluded.fuel`,pv:sql`excluded.pv`,mv:sql`excluded.mv`}});
  return NextResponse.json({ok:v.length})}catch(e:any){return NextResponse.json({error:e.message},{status:400})}}
export async function DELETE(r:NextRequest){const g=await admin();if(g)return g;await db.delete(stationDays).where(eq(stationDays.date,r.nextUrl.searchParams.get("date")!));return NextResponse.json({ok:1})}
