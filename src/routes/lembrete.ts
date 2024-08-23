import { Hono } from "hono";
import { jwt } from "hono/jwt";

import {
  createLembrete,
  deleteLembrete,
  getLembreteById,
  getLembreteByTitulo,
  getLembretes,
  getLembretesIdMedicamento,
  getStatusLembrete,
  updateLembrete,
} from "../controllers/lembrete";
import { verifyToken } from "./verifyToken";

export const lembreteRoutes = new Hono();

lembreteRoutes.use("*", verifyToken);
lembreteRoutes.post("/", (c) => createLembrete(c));
lembreteRoutes.get("/", (c) => getLembretes(c));
lembreteRoutes.get("/:id", (c) => getLembreteById(c));
lembreteRoutes.delete("/:id", (c) => deleteLembrete(c));
lembreteRoutes.put("/:id", (c) => updateLembrete(c));
lembreteRoutes.get("/:id/medicaments", (c) => getLembretesIdMedicamento(c));
lembreteRoutes.post("/titulo", (c) => getLembreteByTitulo(c));
lembreteRoutes.post("/status", (c) => getStatusLembrete(c));
