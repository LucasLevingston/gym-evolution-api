import { prisma } from '@/infrastructure/database/prisma/client'
import { ClientError } from '@/domain/shared/errors/client-error'

export async function getTrainingDayById(id: string) {
  const trainingDay = await prisma.trainingDay.findUnique({
    where: { id },
    include: {
      exercises: {
        include: {
          seriesResults: true,
        },
      },
    },
  })

  if (!trainingDay) {
    throw new ClientError('Training day not found')
  }

  return trainingDay
}
