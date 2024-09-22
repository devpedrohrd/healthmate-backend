import { Professional } from '@prisma/client'
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateProfessionalDto implements Professional {
  @IsInt()
  @IsOptional()
  id: number

  @IsInt()
  @IsNotEmpty()
  userId: number

  @IsString()
  @IsOptional()
  bio: string

  @IsString()
  @IsOptional()
  speciality: string
}
