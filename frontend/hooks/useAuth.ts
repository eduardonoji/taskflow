"use client";

import { useRouter } from "next/navigation";
import { login } from "@/services/authService";

export function useAuth() {
  const router = useRouter();

  async function handleLogin(email: string, password: string) {
    const data = await login(email, password);

    if (!data?.access_token) {
      throw new Error("Token não recebido");
    }

    localStorage.setItem("accessToken", data.access_token);

    router.push("/inicio");
  }

  function logout() {
    localStorage.removeItem("accessToken");
    router.push("/login");
  }

  return { handleLogin, logout };
}