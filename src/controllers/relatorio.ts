import { Context } from "hono";
import { ZodError } from "zod";

import { prisma } from "../config/Prisma";
import { relatorioSchema } from "../schema/schemas";

export const createRelatorio = async (c: Context) => {
  try {
    const body = await c.req.json();

    const { id, ...parseData } = relatorioSchema.parse(body);

    const relatorioExists = await prisma.relatorio.findFirst({
      where: {
        conteudoRelatorio: parseData.conteudoRelatorio,
      },
    });

    if (relatorioExists) {
      return c.json({ error: "Relatorio já existe" }, 409);
    }

    const relatorio = await prisma.relatorio.create({
      data: {
        ...parseData,
        createdAt: new Date().toLocaleString(),
      },
    });

    if (!relatorio) {
      return c.json({ error: "Erro ao criar relatorio" }, 400);
    }

    return c.json({ message: "Relatorio criado com sucesso!" }, 201);
  } catch (e) {
    if (e instanceof ZodError) {
      return c.json({ error: e.errors }, 400);
    }

    console.error("Unexpected Error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const getRelatorios = async (c: Context) => {
  try {
    const relatorios = await prisma.relatorio.findMany();

    if (relatorios.length === 0) {
      return c.json({ error: "Nenhum relatorio encontrado" }, 404);
    }

    return c.json(relatorios, 200);
  } catch (e) {
    if (e instanceof ZodError) {
      return c.json({ error: e.errors }, 400);
    }

    return c.json({ error: "Internal server error" }, 500);
  }
};

export const getRelatorioById = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const relatorio = await prisma.relatorio.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!relatorio) {
      return c.json({ error: "Relatorio não encontrado" }, 404);
    }

    return c.json(relatorio, 200);
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const updateRelatorio = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();

    const { ...parseData } = relatorioSchema.parse(body);

    const relatorio = await prisma.relatorio.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...parseData,
      },
    });

    if (!relatorio) {
      return c.json({ error: "Erro ao atualizar relatorio" }, 400);
    }

    return c.json({ message: "Relatorio atualizado com sucesso!" }, 200);
  } catch (e) {
    if (e instanceof ZodError) {
      return c.json({ error: e.errors }, 400);
    }

    return c.json({ error: "Internal server error" }, 500);
  }
};

export const deleteRelatorio = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const relatorio = await prisma.relatorio.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!relatorio) {
      return c.json({ error: "Erro ao deletar relatorio" }, 400);
    }

    return c.json({ message: "Relatorio deletado com sucesso!" }, 200);
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
};
