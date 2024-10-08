import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common'
import { PatientService } from './patient.service'
import { CreatePatientDto } from './dto/create-patient.dto'
import { UpdatePatientDto } from './dto/update-patient.dto'

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    await this.patientService.create(createPatientDto)

    return {
      message: `PATIENT_CREATED_SUCCESSFULLY`,
      statusCode: HttpStatus.CREATED,
    }
  }

  @Get()
  async findAll() {
    return await this.patientService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.patientService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    await this.patientService.update(id, updatePatientDto)

    return {
      message: `PATIENT_UPDATED_SUCCESSFULLY`,
      statusCode: HttpStatus.OK,
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.patientService.remove(id)

    return {
      message: `PATIENT_DELETED_SUCCESSFULLY`,
      statusCode: HttpStatus.OK,
    }
  }
}
