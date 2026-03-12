import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";

import prisma from '../prismaClient';
import bcrypt from 'bcrypt';

export class AuthService {

  static async login(userId: string) {

    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  static async refresh(refreshToken: string) {

    const payload = verifyRefreshToken(refreshToken) as { userId: string };

    const accessToken = generateAccessToken(payload.userId);

    return {
      accessToken,
    };
  }

}