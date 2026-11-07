import {NextRequest,NextResponse} from "next/server";import {sql} from "drizzle-orm";import {db} from "@/db";import {settings} from "@/db/schema";import {admin,session} from "@/lib/auth";
const D:any={stationName:"Abu Minqar",sfcMin:2.5,sfcMax:4.5,lossWarn:15,lowLevel:20,minDays:3};
export async function GET(){if(!(await session()))return NextResponse.json({error:"Unauthorized"},{status:401});
  const o={...D};(await db.select().from(settings)).forEach(r=>o[r.key]=r.value);return NextResponse.json(o)}
export async function PUT(r:NextRequest){const g=await admin();if(g)return g;const b=await r.json();
  for(const k of Object.keys(D))if(b[k]!==undefined)await db.insert(settings).values({key:k,value:b[k]}).onConflictDoUpdate({target:settings.key,set:{value:sql`excluded.value`}});
  return NextResponse.json({ok:1})}
