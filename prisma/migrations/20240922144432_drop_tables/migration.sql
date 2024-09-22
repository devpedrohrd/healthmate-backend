/*
  Warnings:

  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Professional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PatientToProfessional` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_userId_fkey";

-- DropForeignKey
ALTER TABLE "Professional" DROP CONSTRAINT "Professional_userId_fkey";

-- DropForeignKey
ALTER TABLE "_PatientToProfessional" DROP CONSTRAINT "_PatientToProfessional_A_fkey";

-- DropForeignKey
ALTER TABLE "_PatientToProfessional" DROP CONSTRAINT "_PatientToProfessional_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" VARCHAR(500),
ADD COLUMN     "birthDate" DATE,
ADD COLUMN     "bloodType" VARCHAR(5),
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "weight" DOUBLE PRECISION,
ALTER COLUMN "isActive" DROP NOT NULL,
ALTER COLUMN "address" SET DATA TYPE JSON;

-- DropTable
DROP TABLE "Patient";

-- DropTable
DROP TABLE "Professional";

-- DropTable
DROP TABLE "_PatientToProfessional";

-- CreateTable
CREATE TABLE "_ProfessionalToPatients" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PatientToProfessionals" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProfessionalToPatients_AB_unique" ON "_ProfessionalToPatients"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfessionalToPatients_B_index" ON "_ProfessionalToPatients"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PatientToProfessionals_AB_unique" ON "_PatientToProfessionals"("A", "B");

-- CreateIndex
CREATE INDEX "_PatientToProfessionals_B_index" ON "_PatientToProfessionals"("B");

-- AddForeignKey
ALTER TABLE "_ProfessionalToPatients" ADD CONSTRAINT "_ProfessionalToPatients_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionalToPatients" ADD CONSTRAINT "_ProfessionalToPatients_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientToProfessionals" ADD CONSTRAINT "_PatientToProfessionals_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientToProfessionals" ADD CONSTRAINT "_PatientToProfessionals_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
