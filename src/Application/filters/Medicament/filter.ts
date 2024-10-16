import { Prisma } from '@prisma/client'
import { SearchMedicaments } from '../../medicament/dto/filterMedicaments'

export function builderFilterMedicaments(
  filter: SearchMedicaments,
): Prisma.MedicamentWhereInput {
  const { createdAt, horary, name, quantity, status, userId } = filter

  return {
    ...(createdAt || horary || name || quantity || status || userId
      ? {
          ...(name && { name: { contains: name, mode: 'insensitive' } }),
          ...(status && { status }),
          ...(userId && { userId }),
          ...(quantity && { quantity }),
          ...(createdAt && {
            createdAt: {
              gte: new Date(createdAt),
              lte: new Date(createdAt),
            },
          }),
        }
      : {}),
  }
}
