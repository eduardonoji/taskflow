"use client";

import { useRouter } from "next/navigation";
import { login, logout } from "@/services/authService";

export function useAuth() {
  const router = useRouter();

  async function handleLogin(email: string, password: string) {
    try {
      await login(email, password);
      router.push("/inicio");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/login");
    }
  }

  return { handleLogin, logout: handleLogout };
}