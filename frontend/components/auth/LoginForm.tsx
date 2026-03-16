"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginForm() {
  const { handleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await handleLogin(email, password);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-8 rounded-xl shadow-md border flex flex-col gap-4"
    >
      <h2 className="text-2xl font-semibold text-center">
        Entrar na conta
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {errorMsg && (
        <p className="text-red-500 text-sm">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
      >
        Entrar
      </button>
    </form>
  );
}