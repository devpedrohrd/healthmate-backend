import { Context } from "hono";
import { ZodError } from "zod";

import { prisma } from "../config/Prisma";
import { pacientSchema } from "../schema/pacient";

export const getPacients = async (c: Context) => {
  try {
    const pacients = await prisma.pacient.findMany();

    if (pacients.length === 0) {
      return c.json({ error: "Nenhum paciente encontrado" }, 404);
    }

    return c.json(pacients, 200);
  } catch (err) {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: "Internal Server Error !" }, 500);
  }
};

export const createPacient = async (c: Context) => {
  try {
    const data = await c.req.json();
    const parsedData = pacientSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: {
        id: parsedData.usuarioId,
      },
    });

    if (!user) {
      return c.json({ error: "Usuario nao encontrado" }, 404);
    }

    const pacient = await prisma.pacient.findFirst({
      where: {
        userId: parsedData.usuarioId,
      },
    });

    if (pacient) {
      return c.json({ error: "Usuario ja cadastrado como paciente" }, 400);
    }

    await prisma.pacient.create({
      data: {
        dataNascimento: parsedData.dataNascimento,
        endereco: parsedData.endereco,
        peso: parsedData.peso,
        altura: parsedData.altura,
        pressao: parsedData.pressao,
        observacoes: parsedData.observacoes,
        userId: parsedData.usuarioId,
      },
    });

    return c.json({ message: "Paciente criado com sucesso" }, 201);
  } catch (err) {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: "Internal Server Error !" }, 500);
  }
};

export const getPacientById = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const pacient = await prisma.pacient.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!pacient) {
      return c.json({ error: "Paciente nao encontrado" }, 404);
    }

    return c.json(pacient, 200);
  } catch (err) {
    return c.json({ error: "Internal Server Error !" }, 500);
  }
};

export const updatePacient = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const data = await c.req.json();
    const parsedData = pacientSchema.parse(data);

    const pacient = await prisma.pacient.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!pacient) {
      return c.json({ error: "Paciente nao encontrado" }, 404);
    }

    const up = await prisma.pacient.update({
      where: {
        id: Number(id),
      },
      data: {
        dataNascimento: parsedData.dataNascimento,
        endereco: parsedData.endereco,
        peso: parsedData.peso,
        altura: parsedData.altura,
        pressao: parsedData.pressao,
        observacoes: parsedData.observacoes,
      },
    });

    return c.json({ message: "Paciente atualizado !" }, 200);
  } catch (err) {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: "Internal Server Error !" }, 500);
  }
};

export const deletePacient = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const pacient = await prisma.pacient.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!pacient) {
      return c.json({ error: "Paciente nao encontrado" }, 404);
    }

    await prisma.$transaction([
      prisma.medicaments.deleteMany({
        where: {
          pacientId: Number(id),
        },
      }),
      prisma.pacient.delete({
        where: {
          id: Number(id),
        },
      }),
    ]);

    return c.json({ message: "Paciente deletado !" }, 200);
  } catch (err) {
    return c.json({ error: "Internal Server Error !" }, 500);
  }
};
