import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { AuthService } from "./auth.service.js";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  // mock de usuário
  const user = {
    id: "1",
    email: "test@email.com",
    password: await bcrypt.hash("123456", 10),
  };

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = await AuthService.login(user.id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return res.json({ accessToken });
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const { accessToken } = await AuthService.refresh(refreshToken);

    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  
}