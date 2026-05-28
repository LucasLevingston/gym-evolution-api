import type { FastifyReply, FastifyRequest } from 'fastify'
import { getDietById } from '@/application/diet/get-diet-by-id'
import { isProfessionalAssignedToStudent } from '@/application/training/is-professional-assigned-to-student'
import { User } from '@prisma/client'

interface Params {
  id: string
}

export async function getDietByIdController(
  request: FastifyRequest<{
    Params: Params
  }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const { id: userId, role } = request.user as User

  const diet = await getDietById(id)

  if (diet.userId !== userId && role === 'STUDENT') {
    return reply.status(403).send({ message: 'Forbidden' })
  }

  if (role === 'NUTRITIONIST' && diet.userId !== userId) {
    const isAssigned = await isProfessionalAssignedToStudent(
      userId,
      diet.userId!,
      'NUTRITIONIST'
    )

    if (!isAssigned) {
      return reply.status(403).send({ message: 'You are not assigned to this student' })
    }
  }

  return reply.send(diet)
}
