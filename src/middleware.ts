import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (
    request.nextUrl.pathname.startsWith("/api/admin/") ||
    request.nextUrl.pathname.startsWith("/api/cliente/") ||
    request.nextUrl.pathname.startsWith("/api/meuperfil)") ||
    request.nextUrl.pathname.startsWith("/api/restaurante/") ||
    request.nextUrl.pathname.startsWith("/api/solicitar/") ||
    request.nextUrl.pathname === "/api/gerarTokenparaUsuarios"
  ) {
    if (!token) {
      return new Response("Não autorizado", { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
