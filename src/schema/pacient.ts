import { z } from "zod";

export const pacientSchema = z.object({
  dataNascimento: z.string().refine((dataNascimento) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dataNascimento);
  }),
  endereco: z.string().min(1, "Endereco nao pode ser vazio"),
  peso: z.number().min(1, "Peso invalido"),
  altura: z.number().min(1, "Altura invalida"),
  pressao: z.string().min(1, "Pressao invalida"),
  observacoes: z.string(),
  usuarioId: z.number(),
});
