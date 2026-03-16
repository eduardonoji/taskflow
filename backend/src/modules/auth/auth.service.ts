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
      throw new AppError("User not found", 404);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
        throw new AppError("Invalid credentials", 401);
    }
    
    const access_token = generateAccessToken(user.id);
    const refresh_token = generateRefreshToken(user.id);
    
    const { password: userPassword, ...userData } = user;
    
    return {
      ...userData,
      access_token,
      refresh_token,
    };
  }

  static async refresh(refreshToken: string) {

    const payload = verifyRefreshToken(refreshToken) as { userId: string };

    const accessToken = generateAccessToken(payload.userId);

    return {
      accessToken,
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