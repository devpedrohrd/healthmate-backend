import { Hono } from "hono";

import {
  createProfissional,
  deleteProfissional,
  getProfissional,
  getProfissionalByData,
  getProfissionalByEmail,
  getProfissionalByNome,
  getProfissionals,
  updateProfissional,
} from "../controllers/profissional";

export const profissionalRoutes = new Hono();

profissionalRoutes.post("/", (c) => createProfissional(c));
profissionalRoutes.get("/", (c) => getProfissionals(c));
profissionalRoutes.get("/:id", (c) => getProfissional(c));
profissionalRoutes.post("/email", (c) => getProfissionalByEmail(c));
profissionalRoutes.delete("/:id", (c) => deleteProfissional(c));
profissionalRoutes.put("/:id", (c) => updateProfissional(c));
profissionalRoutes.post("/nome", (c) => getProfissionalByNome(c));
profissionalRoutes.post("/data", (c) => getProfissionalByData(c));
