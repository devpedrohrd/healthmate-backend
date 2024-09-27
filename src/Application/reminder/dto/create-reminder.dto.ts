import { $Enums, Reminder } from '@prisma/client'
import {
  IsInt,
  IsString,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator'

export class CreateReminderDto implements Reminder {
  @IsInt()
  @IsNotEmpty()
  id: number

  @IsInt()
  @IsNotEmpty()
  medicamentId: number

  @IsDate()
  @IsNotEmpty()
  time: Date

  @IsString()
  @IsOptional()
  title: string

  @IsString()
  @IsOptional()
  message: string

  @IsEnum($Enums.ReminderStatus)
  status: $Enums.ReminderStatus

  @IsDate()
  @IsOptional()
  createdAt: Date

  @IsDate()
  @IsOptional()
  updatedAt: Date
}
