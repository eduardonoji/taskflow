import { Router } from "express";
import { login, refresh, register } from "./auth.controller.js";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { loginLimiter, refreshLimiter, registerLimiter } from "../../shared/middlewares/rateLimiter.js";

const router = Router();

router.post("/login", loginLimiter, login);
router.post("/refresh", refreshLimiter, refresh);
router.post("/register", registerLimiter, register);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Você está autenticado!",
    userId: (req as any).userId,
  });
});

export { router as authRoutes };