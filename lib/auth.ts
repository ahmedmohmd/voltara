import {SignJWT,jwtVerify} from "jose";import {cookies} from "next/headers";import {NextResponse} from "next/server";import {eq} from "drizzle-orm";
import {db} from "@/db";import {users} from "@/db/schema";import {COOKIE,secret} from "./secret";
export const sign=(id:number)=>new SignJWT({id}).setProtectedHeader({alg:"HS256"}).setExpirationTime("7d").sign(secret());
export const setCookie=async(id:number)=>(await cookies()).set(COOKIE,await sign(id),{httpOnly:true,sameSite:"lax",path:"/",maxAge:604800,secure:process.env.NODE_ENV==="production"});
export async function session(){const t=(await cookies()).get(COOKIE)?.value;if(!t)return null;
  try{const {id}:any=(await jwtVerify(t,secret())).payload;const [u]=await db.select({id:users.id,name:users.name,email:users.email,role:users.role}).from(users).where(eq(users.id,id));return u||null}catch{return null}}
export async function admin(){const s=await session();return s?.role==="admin"?null:NextResponse.json({error:"Admins only"},{status:403})}
