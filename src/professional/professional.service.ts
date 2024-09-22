import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateProfessionalDto } from './dto/create-professional.dto'
import { UpdateProfessionalDto } from './dto/update-professional.dto'
import { PrismaService } from 'src/Prisma.service'

@Injectable()
export class ProfessionalService {
  constructor(private prismaService: PrismaService) {}

  private async findProfessionalOrThrow(id: number) {
    const professional = await this.prismaService.professional.findUnique({
      where: { id },
    })
    if (!professional) {
      throw new HttpException(`PROFESSIONAL_NOT_FOUND`, HttpStatus.NOT_FOUND)
    }
    return professional ? professional : {}
  }

  private async checkUserExists(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new HttpException(`USER_NOT_FOUND`, HttpStatus.NOT_FOUND)
    }
    return user ? user : {}
  }

  async create(createProfessionalDto: CreateProfessionalDto) {
    const professional = await this.checkUserExists(
      createProfessionalDto.userId,
    )

    if (!professional) {
      throw new HttpException(`USER_NOT_FOUND`, HttpStatus.NOT_FOUND)
    }

    await this.prismaService.professional.create({
      data: createProfessionalDto,
    })
  }

  async findAll() {
    const professionals = await this.prismaService.professional.findMany()

    return professionals.length ? professionals : []
  }

  async findOne(id: number) {
    await this.findProfessionalOrThrow(id)
  }

  async update(id: number, updateProfessionalDto: UpdateProfessionalDto) {
    await this.findProfessionalOrThrow(id)

    await this.prismaService.professional.update({
      where: { id },
      data: {
        ...updateProfessionalDto,
      },
    })
  }

  async remove(id: number) {
    await this.findProfessionalOrThrow(id)

    await this.prismaService.professional.delete({
      where: { id },
    })
  }
}
