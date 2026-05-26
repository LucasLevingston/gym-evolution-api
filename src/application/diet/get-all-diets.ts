import { prisma } from '@/infrastructure/database/prisma/client'

export async function getAllDiets(userId: string) {
  return prisma.diet.findMany({
    where: {
      userId,
    },
    orderBy: {
      weekNumber: 'desc',
    },
    include: {
      meals: true,
    },
  })
}
