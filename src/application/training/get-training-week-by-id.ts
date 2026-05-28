import { prisma } from '@/infrastructure/database/prisma/client'
import { ClientError } from '@/domain/shared/errors/client-error'

export async function getTrainingWeekById(id: string) {
  const trainingWeek = await prisma.trainingWeek.findUnique({
    where: { id },
    include: {
      trainingDays: {
        include: {
          exercises: {
            include: {
              seriesResults: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!trainingWeek) {
    throw new ClientError('Training week not found')
  }

  return trainingWeek
}
