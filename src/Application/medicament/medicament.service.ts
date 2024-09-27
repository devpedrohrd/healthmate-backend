import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateMedicamentDto } from './dto/create-medicament.dto'
import { UpdateMedicamentDto } from './dto/update-medicament.dto'
import { PrismaService } from 'src/Config/Prisma.service'

@Injectable()
export class MedicamentService {
  constructor(private prismaService: PrismaService) {}

  private async findMedicamentOrThrow(id: number) {
    const medicament = await this.prismaService.medicament.findUnique({
      where: { id },
    })
    if (!medicament) {
      throw new HttpException('MEDICAMENT_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    return medicament
  }

  private async findUserById(userId: number) {
    const user = await this.prismaService.user.findMany({
      where: { id: userId },
    })

    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
  }

  async create(createMedicamentDto: CreateMedicamentDto) {
    await this.findUserById(createMedicamentDto.userId)

    const medicament = await this.prismaService.medicament.create({
      data: {
        ...createMedicamentDto,
        updatedAt: null,
      },
    })

    if (!medicament) {
      throw new HttpException('MEDICAMENT_NOT_CREATED', HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    const medicaments = await this.prismaService.medicament.findMany()
    return medicaments.length ? medicaments : []
  }

  async findOne(id: number) {
    const medicament = await this.prismaService.medicament.findUnique({
      where: { id },
    })

    return medicament ? medicament : {}
  }

  async update(id: number, updateMedicamentDto: UpdateMedicamentDto) {
    await this.findMedicamentOrThrow(id)
    await this.findUserById(updateMedicamentDto.userId)

    const medicament = await this.prismaService.medicament.update({
      where: { id },
      data: {
        ...updateMedicamentDto,
      },
    })

    if (!medicament) {
      throw new HttpException('MEDICAMENT_NOT_UPDATED', HttpStatus.BAD_REQUEST)
    }
  }

  async remove(id: number) {
    await this.findMedicamentOrThrow(id)

    const medicament = await this.prismaService.medicament.delete({
      where: { id },
    })

    if (!medicament) {
      throw new HttpException('MEDICAMENT_NOT_DELETED', HttpStatus.BAD_REQUEST)
    }
  }
}
