import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { Context, Next } from "hono";
import { sign } from "hono/jwt";
import { ZodError } from "zod";

import { prisma } from "../config/Prisma";
import { loginSchema } from "../schema/schemas";

const client = new OAuth2Client(Bun.env.GOOGLE_CLIENT_ID as string);

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

    const token = {
      id: user.id,
      email: user.email,
    };

    const access_token = await createToken(token);

    // setar o token no cabeçalho da resposta
    c.header("Authorization", `Bearer ${access_token}`);

    return c.json({ access_token });
  } catch (err) {
    console.error(err);
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: "Internal Server Error!" }, 500);
  }
};

export const loginGoogle = async (c: Context) => {
  try {
    const token =
      c.req.header("Authorization")?.split(" ")[1] || (await c.req.json());

    if (!token) {
      return c.json("Unauthorized", 401);
    }

    const ticket = await client.verifyIdToken({
      idToken: token as string,
      audience: Bun.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const user = await prisma.profissionalSaude.findFirst({
      where: { email: payload.email },
    });

    if (user) {
      return c.redirect("/dashboard");
    }

    await prisma.profissionalSaude.create({
      data: {
        nome: payload.name as string,
        email: payload.email as string,
        senha: "",
        especialidade: "",
        foto_perfil: payload.picture,
        googleId: payload.sub,
        createdAt: new Date().toLocaleString(),
      },
    });
  } catch (error) {
    console.error(error);

    return c.json({ error: "Internal Server Error" }, 500);
  }
};

export const loginPacliente = async (c: Context) => {
  try {
    const body = await c.req.json();

    const parseData = loginSchema.parse(body);

    const user = await prisma.paciente.findFirst({
      where: { email: parseData.email },
    });

    if (!user) {
      return c.json({ error: "Usuario nao encontrado" }, 404);
    }

    const compareHash = await bcrypt.compare(
      parseData.senha,
      user.senha as string
    );

    if (!compareHash) {
      return c.json({ error: "Senha invalida" }, 400);
    }

    const token = {
      id: user.id,
      email: user.email,
    };

    const access_token = await createToken(token);

    // setar o token no cabeçalho da resposta
    c.header("Authorization", `Bearer ${access_token}`);

    return c.json({ access_token });
  } catch (err) {
    console.error();
    throw err;
  }
};
