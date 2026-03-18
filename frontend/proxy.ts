import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = ["/login", "/register", "/forgot-password"];

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;
  console.log("Fui acionado para a rota:", pathname);
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!token && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
    await jwtVerify(token!, secret);
    return NextResponse.next();
  } catch {

    console.log("⚠️ accessToken expirado ou inválido");

    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      console.log("🔄 Tentando renovar o accessToken...");
      // Chama sua rota de refresh no backend
      const response = await fetch("http://localhost:3000/auth/refresh", {
        method: "POST",
        headers: { Cookie: `refreshToken=${refreshToken}` },
      });

      if (!response.ok) {
        console.log("🔴 Refresh falhou:", response);
        console.log("🔴 Refresh falhou, redirecionando para /login");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const nextResponse = NextResponse.next();
      response.headers.getSetCookie().forEach(cookie => {
        nextResponse.headers.append("Set-Cookie", cookie);
      });

      return nextResponse;
    } catch {
      console.log("🔴 Erro ao chamar rota de refresh, redirecionando para /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};