import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

if (!ACCESS_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET não definido nas variáveis de ambiente");
}

if (!REFRESH_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET não definido nas variáveis de ambiente");
}

export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}