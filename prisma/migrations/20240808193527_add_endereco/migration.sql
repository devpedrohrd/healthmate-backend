/*
  Warnings:

  - Added the required column `endereco` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "endereco" JSON NOT NULL;
