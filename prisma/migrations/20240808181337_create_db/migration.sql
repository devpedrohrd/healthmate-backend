-- CreateTable
CREATE TABLE "ProfissionalSaude" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "especialidade" VARCHAR(100),

    CONSTRAINT "ProfissionalSaude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "telefone" VARCHAR(15),

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PacienteProfissionalSaude" (
    "paciente_id" INTEGER NOT NULL,
    "profissional_saude_id" INTEGER NOT NULL,

    CONSTRAINT "PacienteProfissionalSaude_pkey" PRIMARY KEY ("paciente_id","profissional_saude_id")
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

    CONSTRAINT "Medicamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lembrete" (
    "id" SERIAL NOT NULL,
    "medicamento_id" INTEGER NOT NULL,
    "hora_lembrete" TIMESTAMP(3) NOT NULL,
    "mensagem" VARCHAR(255),
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

    CONSTRAINT "AvaliacaoSaude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relatorio" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "profissional_saude_id" INTEGER NOT NULL,
    "conteudo_relatorio" TEXT,

    CONSTRAINT "Relatorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkUnico" (
    "id" SERIAL NOT NULL,
    "profissional_saude_id" INTEGER NOT NULL,
    "link" VARCHAR(255) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ativo',

    CONSTRAINT "LinkUnico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfissionalSaude_email_key" ON "ProfissionalSaude"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_email_key" ON "Paciente"("email");

-- AddForeignKey
ALTER TABLE "PacienteProfissionalSaude" ADD CONSTRAINT "PacienteProfissionalSaude_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PacienteProfissionalSaude" ADD CONSTRAINT "PacienteProfissionalSaude_profissional_saude_id_fkey" FOREIGN KEY ("profissional_saude_id") REFERENCES "ProfissionalSaude"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "LinkUnico" ADD CONSTRAINT "LinkUnico_profissional_saude_id_fkey" FOREIGN KEY ("profissional_saude_id") REFERENCES "ProfissionalSaude"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
