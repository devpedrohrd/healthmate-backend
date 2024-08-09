import { Hono } from "hono";

import { createProfissional, deleteProfissional, getProfissional, getProfissionals, updateProfissional } from "../controllers/profissional";

export const profissionalRoutes = new Hono();

profissionalRoutes.post("/", (c) => createProfissional(c));
profissionalRoutes.get("/", (c) => getProfissionals(c));
profissionalRoutes.get("/:id", (c) => getProfissional(c));
profissionalRoutes.delete("/:id", (c) => deleteProfissional(c));
profissionalRoutes.put("/:id", (c) => updateProfissional(c));
