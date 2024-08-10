import { Context } from "hono";
import { ZodError } from "zod";

import { prisma } from "../config/Prisma";
import { avaliacaoSchema } from "../schema/schemas";

export const createAvaliacao = async (c: Context) => {
  try {
    const body = await c.req.json();

    const avaliacao = avaliacaoSchema.parse(body);

    const avaliacaoExist = await prisma.avaliacaoSaude.findFirst({
      where: {
        ...avaliacao,
      },
    });

    if (avaliacaoExist) {
      return c.json({ erro: "Avaliacao ja cadastrada !" }, 400);
    }

    const newAvaliacao = await prisma.avaliacaoSaude.create({
      data: {
        ...avaliacao,
      },
    });

    if (!newAvaliacao) {
      return c.json({ erro: "Erro ao cadastrar avaliacao !" }, 400);
    }

    return c.json({ message: "Avaliacao cadastrada com sucesso !" }, 201);
  } catch (e) {
    if (e instanceof ZodError) {
      return c.json({ erro: e.errors }, 400);
    }

    return c.json({ erro: "Internal server error !" }, 500);
  }
};

export const getAvaliacao = async (c: Context) => {
  try {
    const avaliacao = await prisma.avaliacaoSaude.findMany();

    if (avaliacao.length === 0) {
      return c.json({ erro: "Nenhuma avaliacao encontrada !" }, 404);
    }

    return c.json(avaliacao, 200);
  } catch (e) {
    if (e instanceof ZodError) {
      return c.json({ erro: e.errors }, 400);
    }
    return c.json({ erro: "Internal server error !" }, 500);
  }
};

export const getAvaliacaoById = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const avaliacao = await prisma.avaliacaoSaude.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!avaliacao) {
      return c.json({ erro: "Avaliacao nao encontrada !" }, 404);
    }

    return c.json(avaliacao, 200);
  } catch (e) {
    if (e instanceof ZodError) {
      return c.json({ erro: e.errors }, 400);
    }
    return c.json({ erro: "Internal server error !" }, 500);
  }
};
export const deleteAvaliacao = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const avaliacao = await prisma.avaliacaoSaude.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!avaliacao) {
      return c.json({ erro: "Avaliacao nao encontrada !" }, 404);
    }

    return c.json({ message: "Avaliacao deletada com sucesso !" }, 200);
  } catch (e) {
    if (e instanceof ZodError) {
      return c.json({ erro: e.errors }, 400);
    }
    return c.json({ erro: "Internal server error !" }, 500);
  }
};

export const updateAvaliacao = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();

    const avaliacao = avaliacaoSchema.parse(body);

    const avaliacaoExist = await prisma.avaliacaoSaude.findFirst({
      where: {
        ...avaliacao,
      },
    });

    if (avaliacaoExist) {
      return c.json({ erro: "Avaliacao ja cadastrada !" }, 400);
    }

    const newAvaliacao = await prisma.avaliacaoSaude.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...avaliacao,
      },
    });

    if (!newAvaliacao) {
      return c.json({ erro: "Erro ao atualizar avaliacao !" }, 400);
    }

    return c.json({ message: "Avaliacao atualizada com sucesso !" }, 200);
  } catch (e) {
    if (e instanceof ZodError) {
      return c.json({ erro: e.errors }, 400);
    }
    return c.json({ erro: "Internal server error !" }, 500);
  }
};
