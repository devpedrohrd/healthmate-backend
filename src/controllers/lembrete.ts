import { Context } from "hono";
import { ZodError } from "zod";

import { prisma } from "../config/Prisma";
import { lembreteSchema } from "../schema/schemas";

export const createLembrete = async (c: Context) => {
  try {
    const body = await c.req.json();

    const { id, ...parseData } = lembreteSchema.parse(body);

    const lembreteExistente = await prisma.lembrete.findFirst({
      where: {
        medicamentoId: parseData.medicamentoId,
        horaLembrete: parseData.horaLembrete,
      },
    });

    if (lembreteExistente) {
      return c.json({ error: "Este lembrete já existe!" }, 400);
    }

    const novoLembrete = await prisma.lembrete.create({
      data: parseData,
    });

    return c.json(
      { message: "Lembrete cadastrado com sucesso!", lembrete: novoLembrete },
      201
    );
  } catch (e) {
    if (e instanceof ZodError) {
      console.error("Erro de validação com Zod:", e.errors);
      return c.json({ error: e.errors }, 400);
    }

    console.error("Erro interno do servidor:", e);
    return c.json({ error: "Internal server error!" }, 500);
  }
};

export const getLembretes = async (c: Context) => {
  try {
    const lembretes = await prisma.lembrete.findMany();

    if (lembretes.length === 0) {
      return c.json({ message: "Nenhum lembrete cadastrado!" }, 404);
    }

    return c.json(lembretes, 200);
  } catch (e) {
    return c.json({ error: "Internal server error!" }, 500);
  }
};

export const getLembreteById = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const lembrete = await prisma.lembrete.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!lembrete) {
      return c.json({ error: "Lembrete não encontrado!" }, 404);
    }

    return c.json(lembrete, 200);
  } catch (e) {
    console.error("Erro interno do servidor:", e);
    return c.json({ error: "Internal server error!" }, 500);
  }
};

export const deleteLembrete = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const lembrete = await prisma.lembrete.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!lembrete) {
      return c.json({ error: "Lembrete não encontrado!" }, 404);
    }

    await prisma.lembrete.delete({
      where: {
        id: Number(id),
      },
    });

    return c.json({ message: "Lembrete deletado com sucesso!" }, 200);
  } catch (e) {
    return c.json({ error: "Internal server error!" }, 500);
  }
};

export const updateLembrete = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();

    const { id: _, ...parseData } = lembreteSchema.parse(body);

    const lembrete = await prisma.lembrete.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!lembrete) {
      return c.json({ error: "Lembrete não encontrado!" }, 404);
    }

    const lembreteAtualizado = await prisma.lembrete.update({
      where: {
        id: Number(id),
      },
      data: parseData,
    });

    return c.json(
      {
        message: "Lembrete atualizado com sucesso!",
        lembrete: lembreteAtualizado,
      },
      200
    );
  } catch (e) {
    if (e instanceof ZodError) {
      return c.json({ error: e.errors }, 400);
    }

    return c.json({ error: "Internal server error!" }, 500);
  }
};
