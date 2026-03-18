import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const result = await AuthService.login(email, password);

  res.cookie("accessToken", result.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1 * 60 * 1000, // 5 min
  });

  res.cookie("refreshToken", result.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  });

  const { access_token, refresh_token, ...safeResult } = result;

  return res.json(safeResult);
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const { access_token, refresh_token } = await AuthService.refresh(refreshToken);

    res.cookie("accessToken", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1 * 60 * 1000,
    });

    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Token refreshed" });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await AuthService.register("Test User", email, password);

  return res.status(201).json(user);

}