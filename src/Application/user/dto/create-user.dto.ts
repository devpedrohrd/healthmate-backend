import { $Enums, User } from '@prisma/client'
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateUserDto implements User {
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
