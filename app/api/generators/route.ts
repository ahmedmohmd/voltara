import {NextRequest,NextResponse} from "next/server";import {and,gte,lte,sql} from "drizzle-orm";import {db} from "@/db";import {genDays} from "@/db/schema";import {admin} from "@/lib/auth";
export async function GET(r:NextRequest){const s=r.nextUrl.searchParams,c:any[]=[];if(s.get("from"))c.push(gte(genDays.date,s.get("from")!));if(s.get("to"))c.push(lte(genDays.date,s.get("to")!));
  return NextResponse.json(await db.select().from(genDays).where(c.length?and(...c):undefined).orderBy(genDays.date,genDays.gen))}
export async function POST(r:NextRequest){const g=await admin();if(g)return g;try{const {rows,replace}=await r.json();if(!rows?.length)throw new Error("Nothing to save");
  for(const x of rows)if(!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||!x.gen||[x.hours,x.energy,x.fuel].some((n:number)=>!isFinite(n)||n<0))throw new Error("Invalid data for "+x.gen+" "+x.date);
  if(replace)await db.delete(genDays).where(and(gte(genDays.date,replace.from),lte(genDays.date,replace.to)));
  for(let i=0;i<rows.length;i+=500)await db.insert(genDays).values(rows.slice(i,i+500)).onConflictDoUpdate({target:[genDays.date,genDays.gen],set:{hours:sql`excluded.hours`,energy:sql`excluded.energy`,fuel:sql`excluded.fuel`}});
  return NextResponse.json({ok:rows.length})}catch(e:any){return NextResponse.json({error:e.message},{status:400})}}
export async function DELETE(r:NextRequest){const g=await admin();if(g)return g;const s=r.nextUrl.searchParams;await db.delete(genDays).where(and(gte(genDays.date,s.get("from")!),lte(genDays.date,s.get("to")!)));return NextResponse.json({ok:1})}
