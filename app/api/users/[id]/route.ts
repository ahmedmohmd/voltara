import {NextRequest,NextResponse} from "next/server";import bcrypt from "bcryptjs";import {eq} from "drizzle-orm";import {db} from "@/db";import {users} from "@/db/schema";import {admin,session} from "@/lib/auth";
const lastAdmin=async(id:number)=>{const a=await db.select({id:users.id}).from(users).where(eq(users.role,"admin"));return a.length===1&&a[0].id===id};
export async function PATCH(r:NextRequest,{params}:{params:Promise<{id:string}>}){const g=await admin();if(g)return g;const id=+(await params).id,b=await r.json(),set:any={};
  if(b.role){if(!["admin","user"].includes(b.role))return NextResponse.json({error:"Invalid role"},{status:400});if(b.role==="user"&&await lastAdmin(id))return NextResponse.json({error:"There must be at least one admin"},{status:400});set.role=b.role}
  if(b.password){if(b.password.length<8)return NextResponse.json({error:"Password must be 8+ characters"},{status:400});set.passwordHash=await bcrypt.hash(b.password,10)}
  if(b.name?.trim())set.name=b.name.trim();if(!Object.keys(set).length)return NextResponse.json({error:"Nothing to change"},{status:400});
  await db.update(users).set(set).where(eq(users.id,id));return NextResponse.json({ok:1})}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){const g=await admin();if(g)return g;const id=+(await params).id,s=await session();
  if(s?.id===id)return NextResponse.json({error:"You cannot delete your own account"},{status:400});if(await lastAdmin(id))return NextResponse.json({error:"There must be at least one admin"},{status:400});
  await db.delete(users).where(eq(users.id,id));return NextResponse.json({ok:1})}
