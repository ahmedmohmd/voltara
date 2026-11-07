import {admin} from "@/lib/auth";
import {NextRequest,NextResponse} from "next/server";import {db} from "@/db";import {months,clients} from "@/db/schema";import {eq} from "drizzle-orm";import {parseFiles,analyze} from "@/lib/analyze";
export async function GET(r:NextRequest){const cid=r.nextUrl.searchParams.get("clientId");
  const q:any=db.select({id:months.id,clientId:months.clientId,client:clients.name,year:months.year,month:months.month,analysis:months.analysis}).from(months).innerJoin(clients,eq(months.clientId,clients.id));
  const rows=await (cid?q.where(eq(months.clientId,+cid)):q);return NextResponse.json(rows.sort((a:any,b:any)=>b.year-a.year||b.month-a.month))}
export async function POST(r:NextRequest){const g=await admin();if(g)return g;try{const f=await r.formData(),files=f.getAll("files") as File[];if(!files.length)throw new Error("Choose a file");
  const {recs,iv}=parseFiles(await Promise.all(files.map(async x=>Buffer.from(await x.arrayBuffer()))));const a=analyze(recs,iv);
  await db.insert(months).values({clientId:+(f.get("clientId") as string),year:+(f.get("year") as string),month:+(f.get("month") as string),analysis:a})
    .onConflictDoUpdate({target:[months.clientId,months.year,months.month],set:{analysis:a}});return NextResponse.json({ok:1})}
  catch(e:any){return NextResponse.json({error:e.message},{status:400})}}
export async function DELETE(r:NextRequest){const g=await admin();if(g)return g;await db.delete(months).where(eq(months.id,+r.nextUrl.searchParams.get("id")!));return NextResponse.json({ok:1})}
