import { Hono } from "hono";

import { createPacient, deletePacient, getPacientById, getPacients, updatePacient } from "../controllers/pacient";

const pacientRoutes = new Hono();

pacientRoutes.get("/", (c) => getPacients(c));
pacientRoutes.post("/", (c) => createPacient(c));
pacientRoutes.get("/:id", (c) => getPacientById(c));
pacientRoutes.put("/:id", (c) => updatePacient(c));
pacientRoutes.delete("/:id", (c) => deletePacient(c));

export { pacientRoutes };
