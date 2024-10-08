/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bloodType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_PatientToProfessionals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProfessionalToPatients` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('CONCLUDED', 'PENDING', 'CANCELED');

-- DropForeignKey
ALTER TABLE "Medicament" DROP CONSTRAINT "Medicament_userId_fkey";

-- DropForeignKey
ALTER TABLE "_PatientToProfessionals" DROP CONSTRAINT "_PatientToProfessionals_A_fkey";

-- DropForeignKey
ALTER TABLE "_PatientToProfessionals" DROP CONSTRAINT "_PatientToProfessionals_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProfessionalToPatients" DROP CONSTRAINT "_ProfessionalToPatients_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfessionalToPatients" DROP CONSTRAINT "_ProfessionalToPatients_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "age",
DROP COLUMN "bio",
DROP COLUMN "birthDate",
DROP COLUMN "bloodType",
DROP COLUMN "height",
DROP COLUMN "image",
DROP COLUMN "weight";

-- DropTable
DROP TABLE "_PatientToProfessionals";

-- DropTable
DROP TABLE "_ProfessionalToPatients";

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "bloodType" VARCHAR(5),
    "birthDate" DATE,
    "address" JSON,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professional" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bio" VARCHAR(500),
    "image" VARCHAR(100),
    "specialty" VARCHAR(255),

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientProfessional" (
    "patientId" INTEGER NOT NULL,
    "professionalId" INTEGER NOT NULL,

    CONSTRAINT "PatientProfessional_pkey" PRIMARY KEY ("patientId","professionalId")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" SERIAL NOT NULL,
    "medicamentId" INTEGER NOT NULL,
    "time" TIME NOT NULL,
    "title" VARCHAR(15),
    "message" VARCHAR(255),
    "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentHealth" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "symptoms" VARCHAR(255),
    "side_effects" VARCHAR(255),
    "observations" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentHealth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PatientProfessionals" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_userId_key" ON "Professional"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_PatientProfessionals_AB_unique" ON "_PatientProfessionals"("A", "B");

-- CreateIndex
CREATE INDEX "_PatientProfessionals_B_index" ON "_PatientProfessionals"("B");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientProfessional" ADD CONSTRAINT "PatientProfessional_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientProfessional" ADD CONSTRAINT "PatientProfessional_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_medicamentId_fkey" FOREIGN KEY ("medicamentId") REFERENCES "Medicament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientProfessionals" ADD CONSTRAINT "_PatientProfessionals_A_fkey" FOREIGN KEY ("A") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientProfessionals" ADD CONSTRAINT "_PatientProfessionals_B_fkey" FOREIGN KEY ("B") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
