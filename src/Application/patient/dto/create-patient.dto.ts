import { Patient } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'
import {
  IsInt,
  IsNumber,
  IsString,
  IsDate,
  IsObject,
  IsOptional,
  IsNotEmpty,
  IsJSON,
} from 'class-validator'
import { CreateUserDto } from 'src/Application/user/dto/create-user.dto'

export class CreatePatientDto implements Patient {
  @IsInt()
  @IsOptional()
  id: number

  @IsInt()
  @IsNotEmpty()
  userId: number

  @IsInt()
  age: number

  @IsNumber()
  @IsOptional()
  weight: number

  @IsNumber()
  @IsOptional()
  height: number

  @IsString()
  @IsOptional()
  bloodType: string

  @IsDate()
  @IsOptional()
  birthDate: Date

  @IsJSON()
  @IsOptional()
  address: JsonValue
  @IsOptional()
  user: CreateUserDto
}
