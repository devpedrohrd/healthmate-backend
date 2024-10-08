import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreatePatientDto } from './dto/create-patient.dto'
import { UpdatePatientDto } from './dto/update-patient.dto'
import { PrismaService } from 'src/Config/Prisma.service'
import { Patient } from '@prisma/client'

@Injectable()
export class PatientService {
  constructor(private prismaService: PrismaService) {}

  async findUserOrThrow(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      throw new HttpException(`USER_NOT_FOUND`, HttpStatus.NOT_FOUND)
    }
    return user
  }

  async create(createPatientDto: CreatePatientDto): Promise<void> {
    const user = await this.findUserOrThrow(createPatientDto.userId)
    const createPatient = await this.prismaService.patient.create({
      data: {
        userId: user.id,
        age: createPatientDto.age,
        weight: createPatientDto.weight,
        height: createPatientDto.height,
        bloodType: createPatientDto.bloodType,
        birthDate: createPatientDto.birthDate,
        address: createPatientDto.address,
      },
    })

    if (!createPatient) {
      throw new HttpException(`PATIENT_NOT_CREATED`, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll(): Promise<
    [count: number, patients: Array<Patient>] | [count: number, patients: []]
  > {
    const patients = await this.prismaService.patient.findMany()

    const count = patients.length

    return patients.length ? [count, patients] : [count, []]
  }

  async findOne(id: number): Promise<Patient | {}> {
    const patient = await this.prismaService.patient.findUnique({
      where: { id },
    })
    return patient ? patient : {}
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<void> {
    const patient = await this.prismaService.patient.update({
      where: { id },
      data: {
        age: updatePatientDto.age,
        weight: updatePatientDto.weight,
        height: updatePatientDto.height,
        bloodType: updatePatientDto.bloodType,
        birthDate: updatePatientDto.birthDate,
        address: updatePatientDto.address,
      },
    })

    if (!patient) {
      throw new HttpException(`PATIENT_NOT_UPDATED`, HttpStatus.BAD_REQUEST)
    }
  }

  async remove(id: number): Promise<void> {
    const patient = await this.prismaService.patient.delete({
      where: { id },
    })

    if (!patient) {
      throw new HttpException(`PATIENT_NOT_DELETED`, HttpStatus.BAD_REQUEST)
    }
  }
}
