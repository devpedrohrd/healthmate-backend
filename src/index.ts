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
import { loginRoutes } from "./routes/login";
import { medicamentRoutes } from "./routes/medicament";
import { pacientRoutes } from "./routes/pacient";
import { userRoutes } from "./routes/user";

// Import the swagger.json file

const app = new Hono();

// Middlewares
app.use(logger());
app.use(cors());
app.use(csrf());
app.use(secureHeaders());

app
  .get("/", (c) => {
    return c.text("API rodando! 🚀👌");
  })
  .get("/set-cookie", async (c) => {
    setCookie(c, "token", "cookie", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    return c.text("Cookie set successfully!");
  });

app.route("/api/login", loginRoutes);
app.route("/api/users", userRoutes);
app.route("/api/pacients", pacientRoutes);
app.route("/api/medicaments", medicamentRoutes);

// app.use("/api/users/*", bearerAuth({ token: Bun.env.JWT_SECRET as string }));

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
