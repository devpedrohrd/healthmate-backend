-- CreateEnum
CREATE TYPE "MedicamentStatus" AS ENUM ('CONCLUDED', 'ACTIVE', 'CANCELED');

-- CreateTable
CREATE TABLE "Medicament" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500),
    "image" VARCHAR(100),
    "message" VARCHAR(255),
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "dosage" VARCHAR(50),
    "horary" TIME NOT NULL,
    "status" "MedicamentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicament_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Medicament" ADD CONSTRAINT "Medicament_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
