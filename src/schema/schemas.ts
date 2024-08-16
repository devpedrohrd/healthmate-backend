import { z } from "zod";

export const profissionalSchema = z.object({
  nome: z.string().regex(/^[\p{L}\s.]+$/u, "Nome invalido"),
  email: z
    .string()
    .trim()
    .min(1, "Email nao pode ser vazio")
    .email("Formato de email invalido"),
  senha: z
    .string()
    .min(6, "Senha deve ter no minimo 6 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, "Senha invalida")
    .optional(),
  foto_perfil: z.string().nullable().optional(),
  especialidade: z.string().max(100).nullable().optional(),
  googleId: z.string().max(100).nullable().optional(),
  id: z.number().int().optional(),
});

export const idSchema = z.object({
  id: z.number().int().positive(),
});

const enderecoSchema = z.object({
  rua: z.string().max(255),
  numero: z.string().max(10),
  cidade: z.string().max(100),
  estado: z.string().regex(/^[A-Z]{2}$/),
  cep: z
    .string()
    .max(20)
    .regex(/^\d{5}-\d{3}$/),
});

export const pacienteSchema = z.object({
  id: z.number().int().positive().optional(),
  nome: z.string().regex(/^[\p{L}\s.]+$/u, "Nome invalido"),
  email: z.string().email().max(100),
  senha: z.string().max(11),
  foto_perfil: z.string().nullable().optional(),
  telefone: z
    .string()
    .max(15)
    .regex(/^\d{2,3}\d{4,5}\d{4}$/),
  endereco: enderecoSchema,
});

export const medicamentoSchema = z.object({
  id: z.number().int().positive().optional(),
  pacienteId: z.number().int().positive(),
  nome: z
    .string()
    .max(100)
    .regex(/^[\p{L}\s.]+$/u, "Nome invalido"),
  descricao: z.string().nullable().optional(),
  dosagem: z.string().max(50).nullable().optional(),
  horario: z.string().max(50).nullable().optional(),
  quantidade: z.number().int().nonnegative().default(0),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email nao pode ser vazio")
    .email("Formato de email invalido"),
  senha: z
    .string()
    .min(6, "Senha deve ter no minimo 6 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "Senha invalida"
    ),
});

export const lembreteSchema = z.object({
  id: z.number().int().nonnegative().optional(),
  medicamentoId: z.number().int().nonnegative(),
  horaLembrete: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Formato de hora invalido(00:00)"),
  titulo: z.string().max(100).nullable(),
  mensagem: z.string().nullable(),
  status: z.enum(["pendente", "concluido", "cancelado"]).default("pendente"),
});

export const avaliacaoSchema = z.object({
  id: z.number().int().nonnegative().optional(),
  pacienteId: z.number().int().positive(),
  observacoes: z.string().max(500).nullable().optional(),
  sintomas: z.string().max(500).nullable().optional(),
  efeitosColaterais: z.string().max(500).nullable().optional(),
});

export const relatorioSchema = z.object({
  id: z.number().int().nonnegative().optional(),
  pacienteId: z.number().int().positive(),
  profissionalSaudeId: z.number().int().positive(),
  conteudoRelatorio: z.string().max(500).nullable().optional(),
});

export const emailSchema = z.object({
  email: z.string().email("Formato de email inválido"),
});
