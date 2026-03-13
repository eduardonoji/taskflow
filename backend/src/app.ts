import express from "express";
import cors from "cors";
import { router } from "./routes/index.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// rota de teste
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// registrar rotas da aplicação
app.use(router);
app.use(errorMiddleware);

export { app };