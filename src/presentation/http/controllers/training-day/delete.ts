import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/infrastructure/database/prisma/client'
export async function deleteTrainingDayController(
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  try {
    await prisma.trainingDay.delete({
      where: { id: request.params.id },
    })
    return reply.send({ message: 'Training day deleted successfully' })
  } catch (error) {
    throw error
  }
}
