-- AlterTable
ALTER TABLE "Lembrete" ALTER COLUMN "hora_lembrete" DROP NOT NULL,
ALTER COLUMN "hora_lembrete" SET DATA TYPE TEXT;
