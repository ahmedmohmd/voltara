import {NextRequest,NextResponse} from "next/server";import bcrypt from "bcryptjs";import {eq} from "drizzle-orm";import {db} from "@/db";import {users} from "@/db/schema";import {session} from "@/lib/auth";
export async function POST(r:NextRequest){const s=await session();if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});const {current,next}=await r.json();
  const [u]=await db.select().from(users).where(eq(users.id,s.id));if(!(await bcrypt.compare(String(current||""),u.passwordHash)))return NextResponse.json({error:"Current password is wrong"},{status:400});
  if((next||"").length<8)return NextResponse.json({error:"New password must be 8+ characters"},{status:400});
  await db.update(users).set({passwordHash:await bcrypt.hash(next,10)}).where(eq(users.id,s.id));return NextResponse.json({ok:1})}
