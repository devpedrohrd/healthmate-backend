import { Hono } from "hono";
import { jwt } from "hono/jwt";

import {
  createPacient,
  deletePacient,
  getMedicamentsByPacient,
  getpacientByData,
  getPacientByEmail,
  getPacientById,
  getPacientByName,
  getPacienteByProfissionalId,
  getPacients,
  updatePacient,
} from "../controllers/pacient";
import { verifyToken } from "./verifyToken";

const pacientRoutes = new Hono();

pacientRoutes.use("*", verifyToken);
pacientRoutes.get("/", (c) => getPacients(c));
pacientRoutes.post("/", (c) => createPacient(c));
pacientRoutes.get("/:id", (c) => getPacientById(c));
pacientRoutes.put("/:id", (c) => updatePacient(c));
pacientRoutes.delete("/:id", (c) => deletePacient(c));
pacientRoutes.get("/:id/medicaments", (c) => getMedicamentsByPacient(c));
pacientRoutes.post("/email", (c) => getPacientByEmail(c));
pacientRoutes.post("/nome", (c) => getPacientByName(c));
pacientRoutes.post("/data", (c) => getpacientByData(c));
pacientRoutes.get("/:id/profissional", (c) => getPacienteByProfissionalId(c));

export { pacientRoutes };
