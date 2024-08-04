import { login } from "../controllers/login";
import { Hono } from "hono";

const loginRoutes = new Hono();

loginRoutes.post("/", (c) => login(c));

export { loginRoutes };
