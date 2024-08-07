import { Context } from "hono";
import { ZodError } from "zod";

import { prisma } from "../config/Prisma";
import { userSchema } from "../schema/user";

export const createUser = async (c: Context) => {
  try {
    const data = await c.req.json();
    const parsedData = userSchema.parse(data);

    const hashedPassword = await Bun.password.hash(parsedData.senha, {
      algorithm: "bcrypt",
      cost: 6,
    });

    const userExists = await prisma.user.findFirst({
      where: {
        email: parsedData.email,
      },
    });

    if (userExists) {
      return c.json({ error: "Usuario ja existe !" }, 400);
    }

    await prisma.user.create({
      data: {
        ...parsedData,
        senha: hashedPassword,
      },
    });

    return c.json({ message: "Usuario criado !" }, 201);
  } catch (err) {
    console.log("Error:", err);

    if (err instanceof ZodError) {
      console.log("Validation Error:", err.errors);
      return c.json({ error: err.errors }, 400);
    }

    console.log("Internal Server Error");
    return c.json({ error: "Internal Server Error !" }, 500);
  }
};

export const getUsers = async (c: Context) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, nome: true, email: true, contato: true, Tipo: true },
    });

    if (users.length === 0) {
      return c.json({ error: "Nenhum usuario encontrado" }, 404);
    }

    return c.json(users, 200);
  } catch (err) {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: "Internal Server Error !" }, 500);
  }
};

export const getUserById = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: { id: true, nome: true, email: true, contato: true, Tipo: true },
    });

    if (!user) {
      return c.json({ error: "Usuario nao encontrado" }, 404);
    }

    return c.json(user, 200);
  } catch (err) {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: "Internal Server Error !" }, 500);
  }
};

export const updateUser = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const data = await c.req.json();
    const parsedData = userSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return c.json({ error: "Usuario nao encontrado" }, 404);
    }

    await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: parsedData,
    });

    return c.json({ message: "Usuario atualizado !" }, 200);
  } catch (err) {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: "Internal Server Error !" }, 500);
  }
};

export const deleteUser = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return c.json({ error: "Usuario nao encontrado" }, 404);
    }

    await prisma.$transaction([
      prisma.medicaments.deleteMany({
        where: { pacientId: Number(id) },
      }),
      prisma.pacient.deleteMany({
        where: { userId: Number(id) },
      }),
      prisma.user.delete({
        where: { id: Number(id) },
      }),
    ]);

    return c.json({ message: "Usuario deletado !" }, 200);
  } catch (err) {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: "Internal Server Error !" }, 500);
  }
};
