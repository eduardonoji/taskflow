import { Router } from "express";
import { login, refresh, register } from "./auth.controller.js";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/register", register);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Você está autenticado!",
    userId: (req as any).userId,
  });
});

export { router as authRoutes };