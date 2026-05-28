import type { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/infrastructure/database/prisma/client'
import type { DayOfWeekEnum } from '@prisma/client'

export async function updateTrainingDayController(
  request: FastifyRequest<{
    Params: { id: string }
    Body: {
      muscleGroups?: string[]
      dayOfWeek?: DayOfWeekEnum
      isCompleted?: boolean
      comments?: string
    }
  }>,
  reply: FastifyReply
) {
  const trainingDay = await prisma.trainingDay.update({
    where: { id: request.params.id },
    data: request.body,
  })
  return reply.send(trainingDay)
}
