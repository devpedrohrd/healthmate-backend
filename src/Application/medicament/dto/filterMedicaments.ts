import { Medicament } from '@prisma/client'

type FilterMedicaments = Pick<
  Medicament,
  'status' | 'horary' | 'name' | 'userId' | 'quantity' | 'createdAt'
> & {
  page?: number
  limit?: number
  offset?: number
}

export type SearchMedicaments = FilterMedicaments
