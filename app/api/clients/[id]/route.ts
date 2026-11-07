import {admin} from "@/lib/auth";
import {NextResponse} from "next/server";import {db} from "@/db";import {clients} from "@/db/schema";import {eq} from "drizzle-orm";
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){const g=await admin();if(g)return g;const {id}=await params;await db.delete(clients).where(eq(clients.id,+id));return NextResponse.json({ok:1})}
