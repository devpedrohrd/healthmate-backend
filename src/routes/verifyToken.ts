import { OAuth2Client } from "google-auth-library";
import { Context, Next } from "hono";
import { verify } from "hono/jwt";

const client = new OAuth2Client(Bun.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = Bun.env.JWT_SECRET as string;

export const verifyToken = async (c: Context, next: Next, role?: string) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return c.json({ error: "Token not found" }, 404);
    }

    const segments = token.split(".");
    if (segments.length !== 3) {
      return c.json({ error: "Invalid token format" }, 400);
    }

    const payload = await verify(token, JWT_SECRET, "HS256");

    if (!payload) {
      return c.json({ error: "Invalid token" }, 401);
    }

    if (role && payload.role !== role) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    c.set("user", payload);

    return next();
  } catch (error) {
    console.error(error);

    if ((error as Error).name === "JwtTokenSignatureMismatched") {
      return c.json({ error: "Unauthorized: Token signature mismatched" }, 401);
    }

    return c.json({ error: "Unauthorized" }, 401);
  }
};
