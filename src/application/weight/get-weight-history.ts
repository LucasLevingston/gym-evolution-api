import { prisma } from '@/infrastructure/database/prisma/client'

export async function getWeightHistory(userId: string) {
  return prisma.weight.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: 'desc',
    },
  })
}
