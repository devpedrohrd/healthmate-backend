import { Hono } from "hono";

import {
  createMedicament,
  deleteMedicament,
  getMedicamentById,
  getMedicaments,
  updateMedicament,
} from "../controllers/medicament";

const medicamentRoutes = new Hono();

medicamentRoutes.post("/", (c) => createMedicament(c));
medicamentRoutes.get("/", (c) => getMedicaments(c));
medicamentRoutes.get("/:id", (c) => getMedicamentById(c));
medicamentRoutes.put("/:id", (c) => updateMedicament(c));
medicamentRoutes.delete("/:id", (c) => deleteMedicament(c));

export { medicamentRoutes };
