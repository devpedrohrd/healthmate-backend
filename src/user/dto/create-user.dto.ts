import { $Enums, User } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateUserDto implements User {
  @IsString()
  @IsOptional()
  bio: string

  @IsInt()
  @IsOptional()
  weight: number

  @IsInt()
  @IsOptional()
  height: number

  @IsString()
  @IsOptional()
  bloodType: string

  @IsDate()
  @IsOptional()
  birthDate: Date
  @IsInt()
  @IsOptional()
  id: number
  @IsString()
  @IsNotEmpty()
  name: string
  @IsEmail()
  @IsNotEmpty()
  email: string
  @IsString()
  @IsNotEmpty()
  password: string
  @IsString()
  @IsOptional()
  phone: string
  @IsEnum($Enums.Role)
  role: $Enums.Role
  @IsInt()
  @IsOptional()
  age: number
  @IsEnum($Enums.Gender)
  gender: $Enums.Gender
  @IsJSON()
  @IsOptional()
  address: JsonValue
  @IsString()
  @IsOptional()
  image: string
  @IsBoolean()
  isActive: boolean
  @IsDate()
  @IsOptional()
  createdAt: Date
  @IsDate()
  @IsOptional()
  updatedAt: Date
}
