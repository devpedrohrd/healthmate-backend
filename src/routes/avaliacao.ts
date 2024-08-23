import { Hono } from "hono";
import { jwt } from "hono/jwt";

import {
  createAvaliacao,
  deleteAvaliacao,
  getAvaliacao,
  getAvaliacaoById,
  updateAvaliacao,
} from "../controllers/avaliacao";
import { verifyToken } from "./verifyToken";

export const avaliacaoRoutes = new Hono();

avaliacaoRoutes.use("*", verifyToken);
avaliacaoRoutes.post("/", (c) => createAvaliacao(c));
avaliacaoRoutes.get("/", (c) => getAvaliacao(c));
avaliacaoRoutes.delete("/:id", (c) => deleteAvaliacao(c));
avaliacaoRoutes.get("/:id", (c) => getAvaliacaoById(c));
avaliacaoRoutes.put("/:id", (c) => updateAvaliacao(c));
