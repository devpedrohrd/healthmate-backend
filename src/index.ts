import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import swagger from "../swagger.json";
import { avaliacaoRoutes } from "./routes/avaliacao";
import { lembreteRoutes } from "./routes/lembrete";
import { loginRoutes } from "./routes/login";
import { medicamentRoutes } from "./routes/medicament";
import { pacientRoutes } from "./routes/pacient";
import { profissionalRoutes } from "./routes/profissional";
import { relatorioRoutes } from "./routes/relatorio";

const app = new Hono();

app.use(logger());
app.use(cors());
// app.use(csrf());
// app.use(secureHeaders());

app.get("/", async (c) => {
  return c.json({ message: "API Online!" });
});

app.route("/login", loginRoutes);
app.route("/pacientes", pacientRoutes);
app.route("/medicamentos", medicamentRoutes);
app.route("/profissional", profissionalRoutes);
app.route("/lembretes", lembreteRoutes);
app.route("/avaliacao", avaliacaoRoutes);
app.route("/relatorio", relatorioRoutes);

app.get("/docs", swaggerUI({ url: "/swagger" }));
app.get("/swagger", async (c) => {
  return c.json(swagger);
});

const port = parseInt(Bun.env.PORT as string, 10) || 3333;

serve({
  fetch: app.fetch,
  port: port,
});

console.log(`Server running on http://localhost:${port}`);
