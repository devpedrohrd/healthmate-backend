import { Patient } from '@prisma/client'

type FilterPatients = Pick<Patient, 'age' | 'bloodType' | 'id' | 'userId'>

export type SearchPatients = FilterPatients & {
  page?: number
  limit?: number
  offset?: number
}
