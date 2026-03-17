import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";

import prisma from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import { AppError } from "../../shared/errors/AppError.js";
export class AuthService {

  static async login(email: string, password: string) {

    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (!user) {
      throw new AppError("Invalid credentials", 404);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
        throw new AppError("Invalid credentials", 401);
    }
    
    const access_token = generateAccessToken(user.id);
    const refresh_token = generateRefreshToken(user.id);
    
    await prisma.refreshToken.create({
      data: {
        token: refresh_token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    const { password: userPassword, ...userData } = user;
    
    return {
      ...userData,
      access_token,
      refresh_token,
    };
  }

  static async refresh(refreshToken: string) {
    // 1. verifica no banco
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });

    if (!storedToken) {
      throw new AppError("Invalid refresh token", 403);
    }

    // 2. valida JWT
    let payload: { userId: string };

    try {
      payload = verifyRefreshToken(refreshToken) as { userId: string };
    } catch {
      throw new AppError("Expired or invalid token", 403);
    }

    // 3. rotação (remove o antigo)
    await prisma.refreshToken.delete({
      where: { token: refreshToken }
    });

    // 4. gera novos tokens
    const newAccessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);

    // 5. salva novo refresh token
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  static async register(name: string, email: string, password: string) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
      },
    });

    return user;
  }
}