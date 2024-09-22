import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common'
import { ProfessionalService } from './professional.service'
import { CreateProfessionalDto } from './dto/create-professional.dto'
import { UpdateProfessionalDto } from './dto/update-professional.dto'

@Controller('professional')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post()
  async create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return await this.professionalService.create(createProfessionalDto)
  }

  @Get()
  async findAll() {
    return await this.professionalService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.professionalService.findOne(+id)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfessionalDto: UpdateProfessionalDto,
  ) {
    return await this.professionalService.update(+id, updateProfessionalDto)
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.professionalService.remove(+id)
  }
}
