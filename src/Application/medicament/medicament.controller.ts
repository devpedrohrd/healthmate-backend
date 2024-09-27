import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { MedicamentService } from './medicament.service'
import { CreateMedicamentDto } from './dto/create-medicament.dto'
import { UpdateMedicamentDto } from './dto/update-medicament.dto'

@Controller('medicament')
export class MedicamentController {
  constructor(private readonly medicamentService: MedicamentService) {}

  @Post()
  async create(@Body() createMedicamentDto: CreateMedicamentDto) {
    await this.medicamentService.create(createMedicamentDto)

    return { message: 'MEDICAMENT_CREATED_SUCESSFULLY' }
  }

  @Get()
  async findAll() {
    return await this.medicamentService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.medicamentService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMedicamentDto: UpdateMedicamentDto,
  ) {
    await this.medicamentService.update(id, updateMedicamentDto)

    return { message: 'MEDICAMENT_UPDATED_SUCESSFULLY' }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.medicamentService.remove(id)

    return { message: 'MEDICAMENT_REMOVED_SUCESSFULLY' }
  }
}
