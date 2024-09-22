import { Module } from '@nestjs/common'
import { ProfessionalService } from './professional.service'
import { ProfessionalController } from './professional.controller'
import { UserModule } from 'src/user/user.module'
import { PrismaService } from 'src/Prisma.service'

@Module({
  controllers: [ProfessionalController],
  providers: [ProfessionalService, PrismaService],
  imports: [UserModule],
})
export class ProfessionalModule {}
