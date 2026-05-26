import { prisma } from '@/infrastructure/database/prisma/client'

export async function getUserHistory(userId: string) {
  return prisma.history.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: 'desc',
    },
  })
}
