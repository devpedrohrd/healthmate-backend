import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { ZodError } from "zod";

import { prisma } from "../config/Prisma";
import { loginSchema, profissionalSchema } from "../schema/schemas";

const JWT_SECRET = Bun.env.JWT_SECRET || "your_jwt_secret";

const createToken = async (payload: any) => {
  return sign(payload, JWT_SECRET, "HS256");
};

export const loginProfissional = async (c: Context) => {
  try {
    const body = await c.req.json();

    const parseData = loginSchema.parse(body);

    const user = await prisma.profissionalSaude.findFirst({
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
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 horas
    });
    return c.json({ message: "Usuario logado!", token }, 200);
  } catch (err) {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: "Internal Server Error!" }, 500);
  }
};

export const loginGoogle = async (c: Context) => {
  try {
    const body = await c.req.json();

    const parseData = profissionalSchema.parse(body);

    const user = await prisma.profissionalSaude.findFirst({
      where: { email: parseData.email },
    });

    if (user) {
      return c.json({ error: "Profissional ja existe !" }, 404);
    }

    const createUser = await prisma.profissionalSaude.create({
      data: {
        nome: parseData.nome,
        email: parseData.email,
        senha: parseData.senha as string,
        foto_perfil: parseData.foto_perfil,
        createdAt: new Date().toLocaleString(),
        googleId: parseData.googleId,
      },
    });

    if (!createUser) {
      return c.json({ error: "Erro ao criar profissional" }, 400);
    }

    return c.json({ message: "Profissional criado com sucesso!" }, 201);
  } catch (err) {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: "Internal Server Error!" }, 500);
  }
};
