import {NextRequest,NextResponse} from "next/server";import bcrypt from "bcryptjs";import {db} from "@/db";import {users} from "@/db/schema";import {setCookie} from "@/lib/auth";
export async function POST(r:NextRequest){const {name,email,password}=await r.json();
  if((await db.select({id:users.id}).from(users).limit(1)).length)return NextResponse.json({error:"Setup already done"},{status:403});
  if(!name?.trim()||!/^\S+@\S+\.\S+$/.test(email||"")||(password||"").length<8)return NextResponse.json({error:"Enter a name, a valid email and a password of 8+ characters."},{status:400});
  const [u]=await db.insert(users).values({name:name.trim(),email:email.toLowerCase(),passwordHash:await bcrypt.hash(password,10),role:"admin"}).returning();await setCookie(u.id);return NextResponse.json({ok:1})}
