import { Hono } from "hono";

import { loginProfissional } from "../controllers/login";

const loginRoutes = new Hono();

loginRoutes.post("/", (c) => loginProfissional(c));

export { loginRoutes };
