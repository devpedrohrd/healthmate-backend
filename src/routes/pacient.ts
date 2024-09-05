import { Context, Hono, Next } from "hono";

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

const verify = async (c: Context, next: Next) => {
  const user = c.get("user");
  const idFromParams = c.req.param("id");

  if (user.role === "profissional") {
    return next();
  }

  if (user.role === "paciente") {
    if (user.id !== Number(idFromParams)) {
      return c.json(
        { error: "Unauthorized: Acesso restrito para este usuario!" },
        403
      );
    }
    return next();
  }

  return c.json({ error: "Unauthorized: Invalid role" }, 403);
};

pacientRoutes.use("*", verifyToken);

pacientRoutes.get("/", verify, (c) => getPacients(c));
pacientRoutes.post("/", verify, (c) => createPacient(c));
pacientRoutes.get("/:id", verify, (c) => getPacientById(c));
pacientRoutes.put("/:id", verify, (c) => updatePacient(c));
pacientRoutes.delete("/:id", verify, (c) => deletePacient(c));
pacientRoutes.get("/:id/medicaments", verify, (c) =>
  getMedicamentsByPacient(c)
);
pacientRoutes.post("/email", verify, (c) => getPacientByEmail(c));
pacientRoutes.post("/nome", verify, (c) => getPacientByName(c));
pacientRoutes.post("/data", verify, (c) => getpacientByData(c));
pacientRoutes.get("/:id/profissional", verify, (c) =>
  getPacienteByProfissionalId(c)
);

export { pacientRoutes };
