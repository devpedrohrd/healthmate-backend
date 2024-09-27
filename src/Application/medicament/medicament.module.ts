import { Module } from '@nestjs/common'
import { MedicamentService } from './medicament.service'
import { MedicamentController } from './medicament.controller'
import { PrismaService } from 'src/Config/Prisma.service'

@Module({
  controllers: [MedicamentController],
  providers: [MedicamentService, PrismaService],
})
export class MedicamentModule {}
