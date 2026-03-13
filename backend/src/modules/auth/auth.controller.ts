import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const result = await AuthService.login(email, password);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return res.json({ result });
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

  const user = await AuthService.register("Test User", email, password);

  return res.status(201).json(user);

}