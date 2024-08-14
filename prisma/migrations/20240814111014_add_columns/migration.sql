/*
  Warnings:

  - You are about to drop the `LinkUnico` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `senha` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LinkUnico" DROP CONSTRAINT "LinkUnico_profissional_saude_id_fkey";

-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "foto_perfil" VARCHAR(255),
ADD COLUMN     "senha" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "ProfissionalSaude" ADD COLUMN     "foto_perfil" VARCHAR(255);

-- DropTable
DROP TABLE "LinkUnico";
