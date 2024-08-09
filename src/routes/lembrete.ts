import { Hono } from "hono";

import {
  createLembrete,
  deleteLembrete,
  getLembreteById,
  getLembretes,
  updateLembrete,
} from "../controllers/lembrete";

export const lembreteRoutes = new Hono();

lembreteRoutes.post("/", (c) => createLembrete(c));
lembreteRoutes.get("/", (c) => getLembretes(c));
lembreteRoutes.get("/:id", (c) => getLembreteById(c));
lembreteRoutes.delete("/:id", (c) => deleteLembrete(c));
lembreteRoutes.put("/:id", (c) => updateLembrete(c));
