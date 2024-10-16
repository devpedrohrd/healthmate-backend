import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateReminderDto } from './dto/create-reminder.dto'
import { UpdateReminderDto } from './dto/update-reminder.dto'
import { PrismaService } from 'src/Config/Prisma.service'
import { SearchReminders } from './dto/filterReminder'
import { builderFilterReminder } from '../filters/Reminder/filter'

@Injectable()
export class ReminderService {
  constructor(private prismaService: PrismaService) {}

  private async checkMedicamentOrThrow(medicamentId: number) {
    const medicament = await this.prismaService.medicament.findUnique({
      where: { id: medicamentId },
    })
    if (!medicament) {
      throw new HttpException('MEDICAMENT_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
  }

  private async findReminderOrThrow(id: number) {
    const reminder = await this.prismaService.reminder.findUnique({
      where: { id },
    })
    if (!reminder) {
      throw new HttpException('REMINDER_NOT_FOUND', HttpStatus.NOT_FOUND)
    }

    return reminder
  }

  async create(createReminderDto: CreateReminderDto) {
    await this.checkMedicamentOrThrow(createReminderDto.medicamentId)

    const reminder = await this.prismaService.reminder.create({
      data: {
        ...createReminderDto,
        updatedAt: null,
      },
    })

    if (!reminder) {
      throw new HttpException(
        'REMINDER_NOT_CREATED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findAll() {
    const reminders = await this.prismaService.reminder.findMany()
    const count = reminders.length

    return reminders.length ? { count, reminders } : { count: 0, reminders: [] }
  }

  async findOne(id: number) {
    const reminder = await this.findReminderOrThrow(id)

    return reminder ? reminder : {}
  }

  async update(id: number, updateReminderDto: UpdateReminderDto) {
    await this.checkMedicamentOrThrow(updateReminderDto.medicamentId)

    const reminder = await this.prismaService.reminder.update({
      where: { id },
      data: {
        ...updateReminderDto,
      },
    })

    if (!reminder) {
      throw new HttpException(
        'REMINDER_NOT_UPDATED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async remove(id: number) {
    await this.findReminderOrThrow(id)
    const remove = await this.prismaService.reminder.delete({
      where: { id },
    })

    if (!remove) {
      throw new HttpException(
        'REMINDER_NOT_DELETED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async searchReminder(filter: SearchReminders) {
    const filterReminder = builderFilterReminder(filter)

    const [reminders, count] = await Promise.all([
      await this.prismaService.reminder.findMany({
        where: filterReminder,
        include: {
          medicament: true,
        },
        orderBy: { createdAt: 'asc' },
        take: filter.limit,
        skip: filter.offset ? filter.offset : 0,
      }),
      await this.prismaService.reminder.count({
        where: filterReminder,
      }),
    ])

    const totalPages = Math.ceil(count / filter.limit || 10)
    const courrentPage =
      Math.floor((filter.offset || 0) / (filter.limit || 10)) + 1

    return { count, totalPages, courrentPage, data: reminders }
  }
}
