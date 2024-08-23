-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "googleId" VARCHAR(255);

-- CreateIndex
CREATE INDEX "avalicaoIdPaciente" ON "AvaliacaoSaude"("paciente_id", "id");

-- CreateIndex
CREATE INDEX "lembreteIdMedicamento" ON "Lembrete"("medicamento_id", "id");

-- CreateIndex
CREATE INDEX "medicamentoIdPaciente" ON "Medicamento"("paciente_id", "id");

-- CreateIndex
CREATE INDEX "googleIdPaciente" ON "Paciente"("googleId", "id");

-- CreateIndex
CREATE INDEX "googleId" ON "ProfissionalSaude"("googleId", "id");

-- CreateIndex
CREATE INDEX "pacienteIdRelatorio" ON "Relatorio"("paciente_id", "id");
