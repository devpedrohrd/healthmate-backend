-- CreateTable
CREATE TABLE "Pacientes" (
    "id" SERIAL NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "endereco" JSONB NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "altura" DOUBLE PRECISION NOT NULL,
    "pressao" TEXT NOT NULL,
    "observacoes" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicamentos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dosagem" TEXT NOT NULL,
    "intervalo" TEXT NOT NULL,
    "pacientId" INTEGER NOT NULL,

    CONSTRAINT "Medicamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pacientes_id_userId_key" ON "Pacientes"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Medicamentos_id_pacientId_key" ON "Medicamentos"("id", "pacientId");

-- AddForeignKey
ALTER TABLE "Pacientes" ADD CONSTRAINT "Pacientes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicamentos" ADD CONSTRAINT "Medicamentos_pacientId_fkey" FOREIGN KEY ("pacientId") REFERENCES "Pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
