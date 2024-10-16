import { Reminder } from '@prisma/client'

type filterReminder = Pick<
  Reminder,
  'id' | 'status' | 'medicamentId' | 'createdAt' | 'time'
>

export type SearchReminders = filterReminder & {
  page?: number
  limit?: number
  offset?: number
}
