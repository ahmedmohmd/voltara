import {NextResponse} from "next/server";import {cookies} from "next/headers";import {COOKIE} from "@/lib/secret";
export async function POST(){(await cookies()).delete(COOKIE);return NextResponse.json({ok:1})}
