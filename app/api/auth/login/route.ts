import {NextRequest,NextResponse} from "next/server";import bcrypt from "bcryptjs";import {eq} from "drizzle-orm";import {db} from "@/db";import {users} from "@/db/schema";import {setCookie} from "@/lib/auth";
export async function POST(r:NextRequest){const {email,password}=await r.json();
  const [u]=await db.select().from(users).where(eq(users.email,String(email||"").toLowerCase()));
  if(!u||!(await bcrypt.compare(String(password||""),u.passwordHash)))return NextResponse.json({error:"Wrong email or password"},{status:401});
  await setCookie(u.id);return NextResponse.json({ok:1})}
