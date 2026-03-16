import express from "express";
import cors from "cors";
import { router } from "./routes/index.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

// middlewares
app.use(
  cors({
    origin: "http://localhost:3001", 
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
// rota de teste
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// registrar rotas da aplicação
app.use(router);
app.use(errorMiddleware);

export { app };