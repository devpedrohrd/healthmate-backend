import { Context } from "hono";
import { medicamentoSchema } from "../schema/medicament";
import { prisma } from "../config/Prisma";
import { z } from "zod";

export const createMedicament = async (c: Context) => {
  try {
    const body = await c.req.json();

    const parseData = medicamentoSchema.parse(body);

    const pacient = await prisma.pacient.findUnique({
      where: {
        id: parseData.pacientId,
      },
    });

    if (!pacient) {
      return c.json({ message: "Paciente nao encontrado" }, 404);
    }

    const medicament = await prisma.medicaments.findMany({
      where: {
        ...parseData,
      },
    });

    if (medicament.length > 0) {
      return c.json({ message: "Medicamento ja cadastrado" }, 409);
    }

    await prisma.medicaments.create({
      data: parseData,
    });
    return c.json({ message: "Medicamento cadastrado com sucesso" }, 201);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ message: err.errors }, 400);
    }
    return c.json({ message: "Erro ao cadastrar medicamento" }, 500);
  }
};

export const getMedicaments = async (c: Context) => {
  try {
    const medicaments = await prisma.medicaments.findMany();

    if (medicaments.length === 0) {
      return c.json({ message: "Nenhum medicamento cadastrado" }, 404);
    }

    return c.json(medicaments);
  } catch (err) {
    return c.json({ message: "Erro ao buscar medicamentos" }, 500);
  }
};

export const getMedicamentById = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const medicament = await prisma.medicaments.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!medicament) {
      return c.json({ message: "Medicamento nao encontrado" }, 404);
    }

    return c.json(medicament);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ message: err.errors }, 400);
    }
    return c.json({ message: "Erro ao buscar medicamento" }, 500);
  }
};

export const updateMedicament = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();

    const parseData = medicamentoSchema.parse(body);

    const medicament = await prisma.medicaments.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!medicament) {
      return c.json({ message: "Medicamento nao encontrado" }, 404);
    }

    await prisma.medicaments.update({
      where: {
        id: parseInt(id),
      },
      data: parseData,
    });

    return c.json({ message: "Medicamento atualizado" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ message: err.errors }, 400);
    }
    return c.json({ message: "Erro ao atualizar medicamento" }, 500);
  }
};

export const deleteMedicament = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const medicament = await prisma.medicaments.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!medicament) {
      return c.json({ message: "Medicamento nao encontrado" }, 404);
    }

    await prisma.medicaments.delete({
      where: {
        id: parseInt(id),
      },
    });

    return c.json({ message: "Medicamento deletado" });
  } catch (err) {
    return c.json({ message: "Erro ao deletar medicamento" }, 500);
  }
};
