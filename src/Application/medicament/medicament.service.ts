import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateMedicamentDto } from './dto/create-medicament.dto'
import { UpdateMedicamentDto } from './dto/update-medicament.dto'
import { PrismaService } from 'src/Config/Prisma.service'
import { SearchMedicaments } from './dto/filterMedicaments'
import { builderFilterMedicaments } from '../filters/Medicament/filter'
import { PrismaClientValidationError } from '@prisma/client/runtime/library'

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
    const count = medicaments.length
    return medicaments.length
      ? { medicaments, count }
      : { count: 0, medicaments: [] }
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

  async searchMedicament(filter: SearchMedicaments) {
    try {
      const filters = builderFilterMedicaments(filter)
      const [medicaments, count] = await Promise.all([
        this.prismaService.medicament.findMany({
          where: filters,
          orderBy: { createdAt: 'asc' },
          skip: filter.offset ? filter.offset : 0,
          take: filter.limit,
        }),
        this.prismaService.medicament.count({ where: filters }),
      ])

      const totalPages = Math.ceil(count / (filter.limit || 10))
      const currentPage =
        Math.floor((filter.offset || 0) / (filter.limit || 10)) + 1

      return { count, totalPages, currentPage, data: medicaments }
    } catch (e) {
      if (e instanceof PrismaClientValidationError) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
      }

      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
