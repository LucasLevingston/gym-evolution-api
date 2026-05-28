import { ClientError } from '@/domain/shared/errors/client-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/infrastructure/database/prisma/client'
export async function getTrainingDayController(
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  try {
    const trainingDay = await prisma.trainingDay.findUnique({
      where: { id: request.params.id },
    })
    if (!trainingDay) {
      new ClientError('Training day not found')
    }
    return reply.send(trainingDay)
  } catch (error) {
    throw error
  }
}
