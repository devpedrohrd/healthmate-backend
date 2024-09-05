import { Hono } from "hono";

import { login, loginGoogle } from "../controllers/login";

const loginRoutes = new Hono();

loginRoutes.post("/", (c) => login(c));
loginRoutes.post("/paciente", (c) => login(c));
loginRoutes.post("/google", (c) => loginGoogle(c));

export { loginRoutes };
