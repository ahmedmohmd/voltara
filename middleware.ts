import {NextRequest,NextResponse} from "next/server";import {jwtVerify} from "jose";import {COOKIE,secret} from "@/lib/secret";
export async function middleware(r:NextRequest){const p=r.nextUrl.pathname;
  if(p.startsWith("/api/auth")||p==="/api/contact")return NextResponse.next();
  const t=r.cookies.get(COOKIE)?.value;if(t){try{await jwtVerify(t,secret());return NextResponse.next()}catch{}}
  return p.startsWith("/api")?NextResponse.json({error:"Unauthorized"},{status:401}):NextResponse.redirect(new URL("/login",r.url))}
export const config={matcher:["/app/:path*","/api/:path*"]};
