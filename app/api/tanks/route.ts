import {NextRequest,NextResponse} from "next/server";import {db} from "@/db";import {tanks} from "@/db/schema";import {admin} from "@/lib/auth";
export async function GET(){return NextResponse.json(await db.select().from(tanks).orderBy(tanks.id))}
export async function POST(r:NextRequest){const g=await admin();if(g)return g;const b=await r.json(),a=Array.isArray(b)?b:[b];
  if(!a.length||a.some((x:any)=>!x.name?.trim()||!(+x.capacity>0)))return NextResponse.json({error:"Enter a tank name and a capacity above 0."},{status:400});
  await db.insert(tanks).values(a.map((x:any)=>({name:x.name.trim(),capacity:+x.capacity})));return NextResponse.json({ok:a.length})}
