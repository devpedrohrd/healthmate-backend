-- CreateEnum
CREATE TYPE "UserTipo" AS ENUM ('Profissional_de_Saude', 'Paciente');

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "Tipo" "UserTipo" NOT NULL DEFAULT 'Paciente',
    "contato" TEXT NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_contato_key" ON "Usuarios"("contato");
