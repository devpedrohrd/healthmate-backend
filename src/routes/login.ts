import { Hono } from "hono";

import { loginPacliente, loginProfissional } from "../controllers/login";

const loginRoutes = new Hono();

loginRoutes.post("/", (c) => loginProfissional(c));
loginRoutes.post("/paciente", (c) => loginPacliente(c));
// loginRoutes.post("/google", (c) => loginGoogle(c));

export { loginRoutes };
