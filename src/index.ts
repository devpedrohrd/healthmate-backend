import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { setCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import swagger from "../swagger.json";
import { lembreteRoutes } from "./routes/lembrete";
import { loginRoutes } from "./routes/login";
import { medicamentRoutes } from "./routes/medicament";
import { pacientRoutes } from "./routes/pacient";
import { profissionalRoutes } from "./routes/profissional";

const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);
app.use(csrf());
app.use(secureHeaders());

app
  .get("/", (c) => {
    return c.text("API rodando! 🚀👌");
  })
  .get("/set-cookie", async (c) => {
    setCookie(c, "token", "cookie", {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });
    return c.text("Cookie set successfully!");
  });

app.route("/api/login", loginRoutes);
app.route("/api/pacientes", pacientRoutes);
app.route("/api/medicamentos", medicamentRoutes);
app.route("api/profissional", profissionalRoutes);
app.route("/api/lembretes", lembreteRoutes);

app.get("/api/docs", swaggerUI({ url: "/api/swagger" }));
app.get("/api/swagger", async (c) => {
  return c.json(swagger);
});

const port = parseInt(Bun.env.PORT as string, 10) || 3000;

serve({
  fetch: app.fetch,
  port: port,
});

console.log(`Server running on http://localhost:${port}`);
