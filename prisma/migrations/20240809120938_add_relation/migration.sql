/*
  Warnings:

  - You are about to drop the `PacienteProfissionalSaude` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PacienteProfissionalSaude" DROP CONSTRAINT "PacienteProfissionalSaude_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "PacienteProfissionalSaude" DROP CONSTRAINT "PacienteProfissionalSaude_profissional_saude_id_fkey";

-- DropTable
DROP TABLE "PacienteProfissionalSaude";

-- CreateTable
CREATE TABLE "_PacienteToProfissionalSaude" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PacienteToProfissionalSaude_AB_unique" ON "_PacienteToProfissionalSaude"("A", "B");

-- CreateIndex
CREATE INDEX "_PacienteToProfissionalSaude_B_index" ON "_PacienteToProfissionalSaude"("B");

-- AddForeignKey
ALTER TABLE "_PacienteToProfissionalSaude" ADD CONSTRAINT "_PacienteToProfissionalSaude_A_fkey" FOREIGN KEY ("A") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PacienteToProfissionalSaude" ADD CONSTRAINT "_PacienteToProfissionalSaude_B_fkey" FOREIGN KEY ("B") REFERENCES "ProfissionalSaude"("id") ON DELETE CASCADE ON UPDATE CASCADE;
