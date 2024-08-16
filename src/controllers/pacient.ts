import { Context } from "hono";
import { ZodError } from "zod";

import { prisma } from "../config/Prisma";
import { pacienteSchema } from "../schema/schemas";

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
      data: { ...parsedData, createdAt: new Date().toLocaleString() },
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

export const getMedicamentsByPacient = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const pacient = await prisma.paciente.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        Medicamento: true,
      },
    });

    if (!pacient) {
      return c.json({ error: "Paciente não encontrado" }, 404);
    }

    if (pacient.Medicamento.length === 0) {
      return c.json({ error: "Nenhum medicamento encontrado" }, 404);
    }

    return c.json(pacient.Medicamento, 200);
  } catch (err) {
    return c.json({ error: "Internal Server Error !" }, 500);
  }
};

export const getPacientByEmail = async (c: Context) => {
  try {
    const body = await c.req.json();

    const pacient = await prisma.paciente.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!pacient) {
      return c.json({ error: "Paciente não encontrado" }, 404);
    }

    return c.json(pacient, 200);
  } catch (err) {
    return c.json({ error: "Internal Server Error !" }, 500);
  }
};

export const getPacientByName = async (c: Context) => {
  try {
    const { nome } = await c.req.json();

    const pacients = await prisma.paciente.findMany({
      where: {
        nome: {
          contains: nome,
        },
      },
    });

    if (pacients.length === 0) {
      return c.json({ error: "Nenhum paciente encontrado" }, 404);
    }

    return c.json(pacients, 200);
  } catch (err) {
    return c.json({ error: "Internal Server Error !" }, 500);
  }
};

export const getpacientByData = async (c: Context) => {
  try {
    const { data } = await c.req.json();

    const dataInicio = `${data}, 00:00:00`;
    const dataFim = `${data}, 23:59:59`;

    console.log("Data Início:", dataInicio);
    console.log("Data Fim:", dataFim);

    const profissional = await prisma.paciente.findMany({
      where: {
        createdAt: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        createdAt: true,
      },
    });

    if (!profissional || profissional.length === 0) {
      return c.json({ message: "Profissional não encontrado" }, 404);
    }

    return c.json(profissional, 200);
  } catch (e) {
    console.error("Erro:", e);
    return c.json({ message: "Erro interno" }, 500);
  }
};
