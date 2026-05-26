import { prisma } from '@/infrastructure/database/prisma/client'

export async function getAllTrainingWeeks(userId: string) {
  return prisma.trainingWeek.findMany({
    where: {
      userId,
    },
    orderBy: {
      weekNumber: 'desc',
    },
    include: {
      trainingDays: true,
    },
  })
}
