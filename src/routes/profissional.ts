import { Context, Hono, Next } from "hono";

import { createProfissional, deleteProfissional, getProfissional, getProfissionalByData, getProfissionalByEmail, getProfissionalByNome, getProfissionals, updateProfissional } from "../controllers/profissional";
import { verifyToken } from "./verifyToken";

export const profissionalRoutes = new Hono();

const verify = async (c: Context, next: Next) => {
  const user = c.get("user");

  if (user.role === "profissional") {
    if (user.id !== c.req.param("id")) {
      return c.json(
        { error: "Unauthorized: Acesso restrito para este usuario ! " },
        403
      );
    }
    return next();
  }

  if (user.role === "paciente") {
    const idFromParams = c.req.param("id");
    if (user.id !== idFromParams) {
      return c.json(
        { error: "Unauthorized: Acesso restrito para este usuario ! " },
        403
      );
    }
    return next();
  }

  return c.json({ error: "Unauthorized: Invalid role" }, 403);
};

// profissionalRoutes.use("*", verifyToken);

profissionalRoutes.post("/", (c) => createProfissional(c));
profissionalRoutes.get("/", verify, (c) => getProfissionals(c));
profissionalRoutes.get("/:id", verify, (c) => getProfissional(c));
profissionalRoutes.post("/email", verify, (c) => getProfissionalByEmail(c));
profissionalRoutes.delete("/:id", verify, (c) => deleteProfissional(c));
profissionalRoutes.put("/:id", verify, (c) => updateProfissional(c));
profissionalRoutes.post("/nome", verify, (c) => getProfissionalByNome(c));
profissionalRoutes.post("/data", verify, (c) => getProfissionalByData(c));
