import { Context } from "hono";
import { z } from "zod";

import { prisma } from "../config/Prisma";
import { idSchema, profissionalSchema } from "../schema/schemas";

export const createProfissional = async (c: Context) => {
  try {
    const body = await c.req.json();
    const parseData = profissionalSchema.parse(body);

    const profExist = await prisma.profissionalSaude.findFirst({
      where: {
        email: parseData.email,
      },
    });

    if (profExist) {
      return c.json({ message: "Profissional já cadastrado" }, 400);
    }

    const profCreate = await prisma.profissionalSaude.create({
      data: { ...parseData, senha: await Bun.password.hash(parseData.senha) },
    });

    if (!profCreate) {
      return c.json({ message: "Erro ao cadastrar profissional" }, 500);
    }

    return c.json({ message: "Profissional cadastrado com sucesso" }, 201);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ message: e.errors }, 400);
    }
    console.error("Erro interno", e);
    return c.json({ message: "Erro interno" }, 500);
  }
};

export const getProfissionals = async (c: Context) => {
  try {
    const profissionals = await prisma.profissionalSaude.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        especialidade: true,
      },
    });

    if (!profissionals) {
      return c.json({ message: "Nenhum profissional encontrado" }, 404);
    }

    return c.json(profissionals, 200);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ message: e.errors }, 400);
    }

    return c.json({ message: "Erro interno" }, 500);
  }
};

export const getProfissional = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const parseId = idSchema.parse({ id: Number(id) });

    const profissional = await prisma.profissionalSaude.findFirst({
      where: {
        id: parseId.id,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        especialidade: true,
      },
    });

    if (!profissional) {
      return c.json({ message: "Profissional não encontrado" }, 404);
    }

    return c.json(profissional, 200);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ message: e.errors }, 400);
    }

    return c.json({ message: "Erro interno" }, 500);
  }
};

export const deleteProfissional = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const parseId = idSchema.parse({ id: Number(id) });

    const profissionalExist = await prisma.profissionalSaude.findFirst({
      where: {
        id: parseId.id,
      },
    });

    if (!profissionalExist) {
      return c.json({ message: "Profissional não encontrado" }, 404);
    }

    const profissional = await prisma.profissionalSaude.delete({
      where: {
        id: parseId.id,
      },
    });

    if (!profissional) {
      return c.json({ message: "Profissional não encontrado" }, 404);
    }

    return c.json({ message: "Profissional deletado com sucesso" }, 200);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ message: e.errors }, 400);
    }

    return c.json({ message: "Erro interno" }, 500);
  }
};

export const updateProfissional = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const parseId = idSchema.parse({ id: Number(id) });

    const body = await c.req.json();
    const parseData = profissionalSchema.parse(body);

    const profissionalExist = await prisma.profissionalSaude.findFirst({
      where: {
        id: parseId.id,
      },
    });

    if (!profissionalExist) {
      return c.json({ message: "Profissional não encontrado" }, 404);
    }

    const profissional = await prisma.profissionalSaude.update({
      where: {
        id: parseId.id,
      },
      data: { ...parseData, senha: await Bun.password.hash(parseData.senha) },
    });

    if (!profissional) {
      return c.json({ message: "Erro ao atualizar profissional" }, 500);
    }

    return c.json({ message: "Profissional atualizado com sucesso" }, 200);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ message: e.errors }, 400);
    }

    return c.json({ message: "Erro interno" }, 500);
  }
};
