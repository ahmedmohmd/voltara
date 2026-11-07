import {NextRequest,NextResponse} from "next/server";
export async function POST(r:NextRequest){const {name,email,message}=await r.json();
  if(!name?.trim()||!/^\S+@\S+\.\S+$/.test(email||"")||!message?.trim())return NextResponse.json({error:"Please fill in all fields with a valid email."},{status:400});
  console.log("CONTACT",{name,email,message});return NextResponse.json({ok:1})}
