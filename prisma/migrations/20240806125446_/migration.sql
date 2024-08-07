/*
  Warnings:

  - Added the required column `horario` to the `Medicamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medicamentos" ADD COLUMN     "horario" TEXT NOT NULL;
