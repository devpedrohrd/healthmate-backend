import { Hono } from "hono";
import { jwt } from "hono/jwt";

import {
  createMedicament,
  deleteMedicament,
  getMedicamentById,
  getMedicaments,
  updateMedicament,
} from "../controllers/medicament";
import { verifyToken } from "./verifyToken";

const medicamentRoutes = new Hono();

medicamentRoutes.use("*", verifyToken);
medicamentRoutes.post("/", (c) => createMedicament(c));
medicamentRoutes.get("/", (c) => getMedicaments(c));
medicamentRoutes.get("/:id", (c) => getMedicamentById(c));
medicamentRoutes.put("/:id", (c) => updateMedicament(c));
medicamentRoutes.delete("/:id", (c) => deleteMedicament(c));

export { medicamentRoutes };
