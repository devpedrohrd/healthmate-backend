import { z } from "zod";

export const medicamentoSchema = z.object({
  nome: z.string().min(1, "Nome do medicamento nao pode ser vazio"),
  descricao: z.string().min(1, "Descricao do medicamento nao pode ser vazia"),
  dosagem: z.string().min(1, "Dosagem do medicamento nao pode ser vazia"),
  horario: z.string().min(1, "Horario do medicamento nao pode ser vazio"),
  intervalo: z.string().min(1, "Intervalo do medicamento nao pode ser vazio"),
  pacientId: z.number().int(),
});
