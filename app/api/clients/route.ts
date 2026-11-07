import {admin} from "@/lib/auth";
import {NextRequest,NextResponse} from "next/server";import {db} from "@/db";import {clients} from "@/db/schema";
export async function GET(){return NextResponse.json(await db.select().from(clients).orderBy(clients.name))}
export async function POST(r:NextRequest){const g=await admin();if(g)return g;try{const {name}=await r.json();if(!name?.trim())throw new Error("Name is required");
  const [c]=await db.insert(clients).values({name:name.trim()}).returning();return NextResponse.json(c)}catch(e:any){return NextResponse.json({error:e.message.includes("unique")?"Client already exists":e.message},{status:400})}}
