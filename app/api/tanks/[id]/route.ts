import {NextRequest,NextResponse} from "next/server";import {eq} from "drizzle-orm";import {db} from "@/db";import {tanks} from "@/db/schema";import {admin} from "@/lib/auth";
export async function PATCH(r:NextRequest,{params}:{params:Promise<{id:string}>}){const g=await admin();if(g)return g;const id=+(await params).id,b=await r.json();
  if(!b.name?.trim()||!(+b.capacity>0))return NextResponse.json({error:"Enter a tank name and a capacity above 0."},{status:400});
  await db.update(tanks).set({name:b.name.trim(),capacity:+b.capacity}).where(eq(tanks.id,id));return NextResponse.json({ok:1})}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){const g=await admin();if(g)return g;await db.delete(tanks).where(eq(tanks.id,+(await params).id));return NextResponse.json({ok:1})}
