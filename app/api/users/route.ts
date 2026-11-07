import {NextRequest,NextResponse} from "next/server";import bcrypt from "bcryptjs";import {db} from "@/db";import {users} from "@/db/schema";import {admin} from "@/lib/auth";
export async function GET(){const g=await admin();if(g)return g;return NextResponse.json(await db.select({id:users.id,name:users.name,email:users.email,role:users.role}).from(users).orderBy(users.id))}
export async function POST(r:NextRequest){const g=await admin();if(g)return g;const {name,email,password,role}=await r.json();
  if(!name?.trim()||!/^\S+@\S+\.\S+$/.test(email||"")||(password||"").length<8||!["admin","user"].includes(role))return NextResponse.json({error:"Enter a name, a valid email, a role and a password of 8+ characters."},{status:400});
  try{await db.insert(users).values({name:name.trim(),email:email.toLowerCase(),passwordHash:await bcrypt.hash(password,10),role});return NextResponse.json({ok:1})}catch{return NextResponse.json({error:"This email already exists"},{status:400})}}
