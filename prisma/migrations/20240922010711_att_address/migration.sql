/*
  Warnings:

  - You are about to drop the column `endereco` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "endereco",
ADD COLUMN     "address" JSONB;
