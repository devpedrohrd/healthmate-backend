import { Prisma } from '@prisma/client'
import { SearchPatients } from 'src/Application/patient/dto/filterPatient'

export function builderFilterPatient(
  filter: SearchPatients,
): Prisma.PatientWhereInput {
  const { age, bloodType, id, userId } = filter

  return {
    ...(age || bloodType || id || userId
      ? {
          ...(age && { age }),
          ...(bloodType && { bloodType }),
          ...(id && { id }),
          ...(userId && { userId }),
        }
      : {}),
  }
}
