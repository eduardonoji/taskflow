"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("https://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("accessToken", data.access_token);
        router.push("/inicio");
      } else {
        setErrorMsg(data.message || "Erro ao fazer login");
      }
    } catch {
      setErrorMsg("Erro de conexão com o servidor");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Entrar
        </button>
      </form>
    </div>
  );
}