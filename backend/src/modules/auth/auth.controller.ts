import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const result = await AuthService.login(email, password);

  res.cookie("refreshToken", result.refresh_token, {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    sameSite: "lax", // adjust as needed (e.g., "strict" or "none")
    path: "/",
  });

  const { refresh_token, ...safeResult } = result;

  return res.json(safeResult);
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const { access_token } = await AuthService.refresh(refreshToken);

    return res.json({ access_token });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await AuthService.register("Test User", email, password);

  return res.status(201).json(user);

}