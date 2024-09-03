import { Hono } from "hono";

import {
  createRelatorio,
  deleteRelatorio,
  getRelatorioById,
  getRelatorios,
  updateRelatorio,
} from "../controllers/relatorio";
import { verifyToken } from "./verifyToken";

export const relatorioRoutes = new Hono();

relatorioRoutes.use("*", verifyToken);
relatorioRoutes.post("/", (c) => createRelatorio(c));
relatorioRoutes.get("/", (c) => getRelatorios(c));
relatorioRoutes.get("/:id", (c) => getRelatorioById(c));
relatorioRoutes.put("/:id", (c) => updateRelatorio(c));
relatorioRoutes.delete("/:id", (c) => deleteRelatorio(c));
