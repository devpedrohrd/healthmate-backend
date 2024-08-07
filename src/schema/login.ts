import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email nao pode ser vazio")
    .email("Formato de email invalido"),
  senha: z
    .string()
    .min(6, "Senha deve ter no minimo 6 caracteres")
    .regex(/^[a-zA-Z0-9]+$/, "Senha invalida"),
});
