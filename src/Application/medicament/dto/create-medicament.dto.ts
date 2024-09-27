import { $Enums, Medicament } from '@prisma/client'
import {
  IsInt,
  IsString,
  IsDate,
  IsEnum,
  IsOptional,
  IsNotEmpty,
} from 'class-validator'

export class CreateMedicamentDto implements Medicament {
  @IsInt()
  @IsNotEmpty()
  userId: number
  @IsInt()
  @IsOptional()
  id: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsOptional()
  image: string

  @IsString()
  @IsOptional()
  message: string

  @IsInt()
  quantity: number

  @IsString()
  @IsOptional()
  dosage: string

  @IsDate()
  @IsOptional()
  horary: Date

  @IsEnum($Enums.MedicamentStatus)
  status: $Enums.MedicamentStatus

  @IsDate()
  @IsOptional()
  createdAt: Date

  @IsDate()
  @IsOptional()
  updatedAt: Date
}
