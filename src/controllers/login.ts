import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { ZodError } from "zod";

import { prisma } from "../config/Prisma";
import { loginSchema } from "../schema/login";

const JWT_SECRET = Bun.env.JWT_SECRET || "your_jwt_secret";

const createToken = async (payload: any) => {
  return sign(payload, JWT_SECRET, "HS256");
};

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();

    const parseData = loginSchema.parse(body);

    const user = await prisma.user.findFirst({
      where: { email: parseData.email },
    });

    if (!user) {
      return c.json({ error: "Usuario nao encontrado" }, 404);
    }

    const compareHash = await Bun.password.verify(parseData.senha, user.senha);

    if (!compareHash) {
      return c.json({ error: "Senha invalida" }, 400);
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
    });

    setCookie(c, "access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return c.json({ message: "Usuario logado!", token }, 200);
  } catch (err) {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: "Internal Server Error!" }, 500);
  }
};
