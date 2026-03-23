import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Rotas de autenticação — logado não deve acessar
const authRoutes = ["/login", "/register", "/forgot-password"];

// Rotas totalmente públicas — qualquer um pode acessar
const publicRoutes = ["/about", "/pricing", "/blog", "/termos"];

export async function proxy(request: NextRequest) {

  const { pathname } = request.nextUrl;
  const loginUrl = new URL("/login", request.url);

  // Rota totalmente pública — passa sempre
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);

  // Auth route — se já está logado, redireciona para home
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/inicio", request.url));
      } catch {}
    }
    return NextResponse.next();
  }

  try {
    await jwtVerify(token!, secret);
    return NextResponse.next();
  } catch {

    if (!refreshToken) {
      return NextResponse.redirect(loginUrl);
    }
    const refreshSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!);
    try {
      await jwtVerify(refreshToken, refreshSecret);
    } catch {
      return NextResponse.redirect(loginUrl);
    }
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
        method: "POST",
        headers: { Cookie: `refreshToken=${refreshToken}` },
        signal: AbortSignal.timeout(3000),
      });

      if (!response.ok) {
        return NextResponse.redirect(loginUrl);
      }
      const nextRes = NextResponse.next();
      response.headers.getSetCookie().forEach((c: string) => nextRes.headers.append("Set-Cookie", c));
      return nextRes;
    } catch {
      return NextResponse.redirect(loginUrl);
    }
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|auth/|.*\\..*).*)",
  ],
};