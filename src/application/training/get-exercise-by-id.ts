import { prisma } from '@/infrastructure/database/prisma/client'
import { ClientError } from '@/domain/shared/errors/client-error'

export async function getExerciseById(id: string) {
  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      seriesResults: true,
    },
  })

  if (!exercise) {
    throw new ClientError('Exercise not found')
  }

  return exercise
}
