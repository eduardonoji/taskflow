"use client";

import { useRouter } from "next/navigation";
import { login } from "@/services/authService";

export function useAuth() {
  const router = useRouter();

  async function handleLogin(email: string, password: string) {
    const data = await login(email, password);

    localStorage.setItem("accessToken", data.access_token);

    router.push("/inicio");
  }

  function logout() {
    localStorage.removeItem("accessToken");
    router.push("/login");
  }

  return { handleLogin, logout };
}