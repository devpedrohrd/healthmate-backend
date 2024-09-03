-- CreateEnum
CREATE TYPE "sexo" AS ENUM ('masculino', 'feminino', 'outro');

-- CreateTable
CREATE TABLE "ProfissionalSaude" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "especialidade" VARCHAR(100),
    "foto_perfil" VARCHAR(255),
    "googleId" VARCHAR(255),
    "createdAt" VARCHAR(255),

    CONSTRAINT "ProfissionalSaude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "telefone" VARCHAR(15),
    "endereco" JSON NOT NULL,
    "senha" VARCHAR(255),
    "foto_perfil" VARCHAR(255),
    "createdAt" VARCHAR(255),
    "googleId" VARCHAR(255),
    "dataNascimento" VARCHAR(255),
    "sexo" "sexo",

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicamento" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT,
    "dosagem" VARCHAR(50),
    "horario" VARCHAR(50),
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "createdAt" VARCHAR(255),

    CONSTRAINT "Medicamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lembrete" (
    "id" SERIAL NOT NULL,
    "medicamento_id" INTEGER NOT NULL,
    "hora_lembrete" TEXT,
    "titulo" VARCHAR(100),
    "mensagem" VARCHAR(255),
    "createdAt" VARCHAR(255),
    "status" VARCHAR(20) NOT NULL DEFAULT 'pendente',

    CONSTRAINT "Lembrete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvaliacaoSaude" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "sintomas" TEXT,
    "efeitos_colaterais" TEXT,
    "observacoes" TEXT,
    "createdAt" VARCHAR(255),

    CONSTRAINT "AvaliacaoSaude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relatorio" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "profissional_saude_id" INTEGER NOT NULL,
    "conteudo_relatorio" TEXT,
    "createdAt" VARCHAR(255),

    CONSTRAINT "Relatorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PacienteToProfissionalSaude" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfissionalSaude_email_key" ON "ProfissionalSaude"("email");

-- CreateIndex
CREATE INDEX "googleId" ON "ProfissionalSaude"("googleId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_email_key" ON "Paciente"("email");

-- CreateIndex
CREATE INDEX "googleIdPaciente" ON "Paciente"("googleId", "id");

-- CreateIndex
CREATE INDEX "medicamentoIdPaciente" ON "Medicamento"("paciente_id", "id");

-- CreateIndex
CREATE INDEX "lembreteIdMedicamento" ON "Lembrete"("medicamento_id", "id");

-- CreateIndex
CREATE INDEX "avalicaoIdPaciente" ON "AvaliacaoSaude"("paciente_id", "id");

-- CreateIndex
CREATE INDEX "pacienteIdRelatorio" ON "Relatorio"("paciente_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "_PacienteToProfissionalSaude_AB_unique" ON "_PacienteToProfissionalSaude"("A", "B");

-- CreateIndex
CREATE INDEX "_PacienteToProfissionalSaude_B_index" ON "_PacienteToProfissionalSaude"("B");

-- AddForeignKey
ALTER TABLE "Medicamento" ADD CONSTRAINT "Medicamento_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lembrete" ADD CONSTRAINT "Lembrete_medicamento_id_fkey" FOREIGN KEY ("medicamento_id") REFERENCES "Medicamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoSaude" ADD CONSTRAINT "AvaliacaoSaude_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relatorio" ADD CONSTRAINT "Relatorio_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relatorio" ADD CONSTRAINT "Relatorio_profissional_saude_id_fkey" FOREIGN KEY ("profissional_saude_id") REFERENCES "ProfissionalSaude"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PacienteToProfissionalSaude" ADD CONSTRAINT "_PacienteToProfissionalSaude_A_fkey" FOREIGN KEY ("A") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PacienteToProfissionalSaude" ADD CONSTRAINT "_PacienteToProfissionalSaude_B_fkey" FOREIGN KEY ("B") REFERENCES "ProfissionalSaude"("id") ON DELETE CASCADE ON UPDATE CASCADE;
