// src/app/dashboard/page.tsx
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${process.env.BACKEND_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  const sucesso = res.status === 200;

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Token (últimos 12 chars): <code>...{token?.slice(-12) ?? "nenhum"}</code></p>

      <div style={{
        marginTop: "1rem",
        padding: "1rem",
        background: sucesso ? "#e8f5e9" : "#ffebee",
        border: `1px solid ${sucesso ? "#4caf50" : "#f44336"}`,
        borderRadius: "8px"
      }}>
        <p>Status: <strong>{res.status}</strong></p>
        <p>Mensagem: <strong>{data.message}</strong></p>
        {data.userId && <p>userId: <strong>{data.userId}</strong></p>}
      </div>

      {!sucesso && (
        <p style={{ marginTop: "1rem", color: "#b71c1c" }}>
          ⚠️ Middleware renovou o token mas o Server Component recebeu o expirado.
          Troque REFRESH_MODE para "redirect" no middleware.ts.
        </p>
      )}
    </div>
  );
}