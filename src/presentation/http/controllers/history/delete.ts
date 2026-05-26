import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/infrastructure/database/prisma/client'
export async function deleteHistoryController(
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  try {
    await prisma.history.delete({
      where: { id: request.params.id },
    })
    return reply.send({ message: 'History entry deleted successfully' })
  } catch (error) {
    throw error
  }
}
