import {
  createAvaliacao,
  deleteAvaliacao,
  getAvaliacao,
  getAvaliacaoById,
  updateAvaliacao,
} from "../controllers/avaliacao";
import { Hono } from "hono";

export const avaliacaoRoutes = new Hono();

avaliacaoRoutes.post("/", (c) => createAvaliacao(c));
avaliacaoRoutes.get("/", (c) => getAvaliacao(c));
avaliacaoRoutes.delete("/:id", (c) => deleteAvaliacao(c));
avaliacaoRoutes.get("/:id", (c) => getAvaliacaoById(c));
avaliacaoRoutes.put("/:id", (c) => updateAvaliacao(c));
