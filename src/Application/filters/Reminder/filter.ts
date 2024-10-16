import { Prisma } from '@prisma/client'
import { SearchReminders } from 'src/Application/reminder/dto/filterReminder'

export function builderFilterReminder(
  filter: SearchReminders,
): Prisma.ReminderWhereInput {
  const { id, status, medicamentId, createdAt, time } = filter

  return {
    ...(id || status || createdAt || time || medicamentId
      ? {
          ...(id && { id }),
          ...(status && { status }),
          ...(medicamentId && { medicamentId }),
          ...(createdAt && { createdAt }),
          ...(time && { time }),
        }
      : {}),
    ...(medicamentId
      ? {
          medicament: {
            id: medicamentId,
          },
        }
      : {}),
  }
}
