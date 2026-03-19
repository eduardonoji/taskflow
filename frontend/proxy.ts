import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Rotas de autenticação — logado não deve acessar
const authRoutes = ["/login", "/register", "/forgot-password"];

// Rotas totalmente públicas — qualquer um pode acessar
const publicRoutes = ["/about", "/pricing", "/blog", "/termos"];

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;
  console.log("Fui acionado para a rota:", pathname);
  // Rota totalmente pública — passa sempre
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Auth route — se já está logado, redireciona para home
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch {
        // token inválido, deixa acessar o login normalmente
      }
    }
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
      const response = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
        method: "POST",
        headers: { Cookie: `refreshToken=${refreshToken}` },
      });

      if (!response.ok) {
        console.log("🔴 Refresh falhou:", response);
        console.log("🔴 Refresh falhou, redirecionando para /login");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const redirectResponse = NextResponse.redirect(request.url);
      response.headers.getSetCookie().forEach(cookie => {
        redirectResponse.headers.append("Set-Cookie", cookie);
      });

      return redirectResponse;
    } catch {
      console.log("🔴 Erro ao chamar rota de refresh, redirecionando para /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};