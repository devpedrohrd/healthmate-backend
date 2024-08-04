import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getSignedCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { loginRoutes } from "./routes/login";
import { userRoutes } from "./routes/user";
import { pacientRoutes } from "./routes/pacient";
import { JWT_SECRET } from "./controllers/login";

const app = new Hono();

// Middlewares
app.use(logger());
app.use(cors());
app.use(csrf());
app.use(secureHeaders());

app.get("/", (c) => {
  return c.text("API rodando! 🚀👌");
});

// app.use("/api/users/*", async (c, next) => {
//   const tokenFromCookie = await getSignedCookie(c, JWT_SECRET, "token");
//   console.log("Token from Cookie:", tokenFromCookie);

//   const authHeader = c.req.header("Authorization");
//   console.log("Authorization Header:", authHeader);

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return c.json({ error: "Nao autorizado" }, 401);
//   }

//   const tokenFromHeader = authHeader.substring(7);
//   console.log("Token from Header:", tokenFromHeader);

//   if (tokenFromCookie !== tokenFromHeader) {
//     return c.json({ error: "Nao autorizado" }, 401);
//   }

//   await next();
// });

app.route("/api/users", userRoutes);
app.route("/api/login", loginRoutes);
app.route("/api/pacients", pacientRoutes);

const port = parseInt(Bun.env.PORT as string, 10) || 3000;

serve({
  fetch: app.fetch,
  port: port,
});

console.log(`Server running on http://localhost:${port}`);
