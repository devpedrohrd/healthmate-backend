import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common'
import { ReminderService } from './reminder.service'
import { CreateReminderDto } from './dto/create-reminder.dto'
import { UpdateReminderDto } from './dto/update-reminder.dto'
import { SearchReminders } from './dto/filterReminder'

@Controller('reminder')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post()
  async create(@Body() createReminderDto: CreateReminderDto) {
    await this.reminderService.create(createReminderDto)

    return { message: 'REMINDER_CREATED' }
  }

  @Get()
  async findAll() {
    return await this.reminderService.findAll()
  }

  @Get('search')
  async searchReminder(@Query() filter: SearchReminders) {
    const limit = filter.limit ? filter.limit : 10
    const courrentPage = filter.page ? filter.page : 1

    const offset = (courrentPage - 1) * 1

    filter.limit = limit
    filter.offset = offset

    return await this.reminderService.searchReminder(filter)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.reminderService.findOne(id)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReminderDto: UpdateReminderDto,
  ) {
    await this.reminderService.update(id, updateReminderDto)

    return { message: 'REMINDER_UPDATED' }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.reminderService.remove(id)

    return { message: 'REMINDER_DELETED' }
  }
}
