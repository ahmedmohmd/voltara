import {NextRequest,NextResponse} from "next/server";import {and,gte,lte,eq,sql} from "drizzle-orm";import {db} from "@/db";import {tankLevels,tanks} from "@/db/schema";import {admin} from "@/lib/auth";
export async function GET(r:NextRequest){const s=r.nextUrl.searchParams,c:any[]=[];if(s.get("from"))c.push(gte(tankLevels.date,s.get("from")!));if(s.get("to"))c.push(lte(tankLevels.date,s.get("to")!));
  return NextResponse.json(await db.select().from(tankLevels).where(c.length?and(...c):undefined).orderBy(tankLevels.date))}
export async function POST(r:NextRequest){const g=await admin();if(g)return g;try{const {date,levels}=await r.json();if(!/^\d{4}-\d{2}-\d{2}$/.test(date||"")||!levels?.length)throw new Error("Choose a date and enter at least one tank level.");
  const cap:any={};(await db.select().from(tanks)).forEach(t=>cap[t.id]=t);
  for(const l of levels){const t=cap[l.tankId];if(!t)throw new Error("Unknown tank");if(!isFinite(+l.liters)||+l.liters<0)throw new Error(`${t.name}: enter a valid number of liters`);if(+l.liters>t.capacity*1.001)throw new Error(`${t.name} cannot hold more than ${t.capacity.toLocaleString()} L`)}
  await db.insert(tankLevels).values(levels.map((l:any)=>({date,tankId:l.tankId,liters:+l.liters}))).onConflictDoUpdate({target:[tankLevels.date,tankLevels.tankId],set:{liters:sql`excluded.liters`}});return NextResponse.json({ok:1})}
  catch(e:any){return NextResponse.json({error:e.message},{status:400})}}
export async function DELETE(r:NextRequest){const g=await admin();if(g)return g;await db.delete(tankLevels).where(eq(tankLevels.date,r.nextUrl.searchParams.get("date")!));return NextResponse.json({ok:1})}
