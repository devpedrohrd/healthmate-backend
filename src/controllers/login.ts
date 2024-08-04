import { Context } from "hono";
import { setCookie, setSignedCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { ZodError } from "zod";

import { prisma } from "../config/Prisma";

export const JWT_SECRET = process.env.JWT_SECRET || "";

const createToken = async (payload: any) => {
  return sign(payload, JWT_SECRET, "HS256");
};

export const login = async (c: Context) => {
  try {
    const { email, senha } = await c.req.json();

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return c.json({ error: "Usuario nao encontrado" }, 404);
    }

    const compareHash = await Bun.password.verify(senha, user.senha);

    if (!compareHash) {
      return c.json({ error: "Senha invalida" }, 400);
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // esse token expira em 1 hora
    });

    console.log("Generated Token:", token);

    await setSignedCookie(c, "token", token, JWT_SECRET, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
    });

    console.log("Cookie set");

    return c.json({ message: "Usuario logado!", token }, 200);
  } catch (err) {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: "Internal Server Error!" }, 500);
  }
};
