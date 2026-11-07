import {NextResponse} from "next/server";import {db} from "@/db";import {users} from "@/db/schema";
export async function GET(){return NextResponse.json({hasUsers:(await db.select({id:users.id}).from(users).limit(1)).length>0})}
