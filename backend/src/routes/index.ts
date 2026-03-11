import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.get("/", (req, res) => {
  res.json({ message: "TaskFlow API" });
});


export { router };