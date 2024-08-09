import { pacienteSchema } from "../schema/schemas";
import { Context } from "hono";
import { ZodError } from "zod";

import { prisma } from "../config/Prisma";

export const getPacients = async (c: Context) => {
  try {
    const pacients = await prisma.paciente.findMany();

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
    const parsedData = pacienteSchema.parse(data);

    const user = await prisma.paciente.findUnique({
      where: {
        email: parsedData.email,
      },
    });

    if (user) {
      return c.json({ error: "Usuario com este email já existe !" }, 404);
    }

    await prisma.paciente.create({
      data: parsedData,
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
    const pacient = await prisma.paciente.findUnique({
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

    const parsedData = pacienteSchema.parse(data);

    console.log(parsedData);

    const pacient = await prisma.paciente.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!pacient) {
      return c.json({ error: "Paciente não encontrado" }, 404);
    }

    const updatedPacient = await prisma.paciente.update({
      where: {
        id: Number(id),
      },
      data: parsedData,
    });

    return c.json(
      { message: "Paciente atualizado com sucesso!", paciente: updatedPacient },
      200
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }

    console.error("Erro interno:", err);
    return c.json({ error: "Erro interno no servidor" }, 500);
  }
};

export const deletePacient = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const pacient = await prisma.paciente.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!pacient) {
      return c.json({ error: "Paciente nâo encontrado" }, 404);
    }

    await prisma.$transaction([
      prisma.medicamento.deleteMany({
        where: {
          pacienteId: Number(id),
        },
      }),
      prisma.paciente.delete({
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
