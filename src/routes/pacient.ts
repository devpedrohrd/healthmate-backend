import { Hono } from "hono";

import {
  createPacient,
  deletePacient,
  getMedicamentsByPacient,
  getpacientByData,
  getPacientByEmail,
  getPacientById,
  getPacientByName,
  getPacients,
  updatePacient,
} from "../controllers/pacient";

const pacientRoutes = new Hono();

pacientRoutes.get("/", (c) => getPacients(c));
pacientRoutes.post("/", (c) => createPacient(c));
pacientRoutes.get("/:id", (c) => getPacientById(c));
pacientRoutes.put("/:id", (c) => updatePacient(c));
pacientRoutes.delete("/:id", (c) => deletePacient(c));
pacientRoutes.get("/:id/medicaments", (c) => getMedicamentsByPacient(c));
pacientRoutes.post("/email", (c) => getPacientByEmail(c));
pacientRoutes.post("/nome", (c) => getPacientByName(c));
pacientRoutes.post("/data", (c) => getpacientByData(c));

export { pacientRoutes };
