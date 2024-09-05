import { compare } from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { Context } from "hono";
import { sign } from "hono/jwt";
import { ZodError } from "zod";

import { prisma } from "../config/Prisma";
import { loginSchema } from "../schema/schemas";

const client = new OAuth2Client(Bun.env.GOOGLE_CLIENT_ID as string);

const JWT_SECRET = Bun.env.JWT_SECRET || "your_jwt_secret";

const createToken = async (payload: any) => {
  return sign(payload, JWT_SECRET, "HS256");
};

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();

    const parseData = loginSchema.parse(body);

    const [profissionalSaude, paciente] = await Promise.all([
      prisma.profissionalSaude
        .findFirst({
          where: { email: parseData.email },
        })
        .catch((err) => {
          console.error("Error fetching profissionalSaude:", err);
          return null;
        }),
      prisma.paciente
        .findFirst({
          where: { email: parseData.email },
        })
        .catch((err) => {
          console.error("Error fetching paciente:", err);
          return null;
        }),
    ]);
    let user = null;
    let role = null;

    if (
      profissionalSaude &&
      (await Bun.password.verify(parseData.senha, profissionalSaude.senha))
    ) {
      user = profissionalSaude;
      role = "profissional";
    } else if (
      paciente &&
      (await compare(parseData.senha, paciente.senha as string))
    ) {
      user = paciente;
      role = "paciente";
    }

    if (!user) {
      return c.json({ error: "Usuario ou senha invalidos" }, 400);
    }

    const token = {
      id: user.id,
      email: user.email,
      role,
    };

    const access_token = await createToken(token);
    c.header("Authorization", `Bearer ${access_token}`);
    return c.json({ message: "Login efetuado com sucesso", access_token });
  } catch (err) {
    console.error("Error during login:", err);
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
