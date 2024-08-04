import { z } from "zod";

export const userSchema = z.object({
  nome: z.string().regex(/^[\p{L}\s]+$/u, "Nome invalido"),
  email: z
    .string()
    .trim()
    .min(1, "Email nao pode ser vazio")
    .email("Formato de email invalido"),
  senha: z
    .string()
    .min(6, "Senha deve ter no minimo 6 caracteres")
    .regex(/^[a-zA-Z0-9]+$/, "Senha invalida"),
  contato: z.string().regex(/^[0-9]{10,11}$/, "Formato de telefone invalido"),
  id: z.number().optional(),
});
