import { loginGoogle, loginProfissional } from "../controllers/login";
import { Hono } from "hono";

const loginRoutes = new Hono();

loginRoutes.post("/", (c) => loginProfissional(c));
loginRoutes.post("/google", (c) => loginGoogle(c));

export { loginRoutes };
