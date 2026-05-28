import type { FastifyReply, FastifyRequest } from 'fastify'
import { getTrainingWeekById } from '@/application/training/get-training-week-by-id'
import { isProfessionalAssignedToStudent } from '@/application/training/is-professional-assigned-to-student'
import { User } from '@prisma/client'

interface Params {
  id: string
}

export async function getTrainingWeekByIdController(
  request: FastifyRequest<{
    Params: Params
  }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const { id: userId, role } = request.user as User

  const trainingWeek = await getTrainingWeekById(id)

  if (trainingWeek.userId !== userId && role === 'STUDENT') {
    return reply.status(403).send({ message: 'Forbidden' })
  }

  if ((role === 'TRAINER' || role === 'NUTRITIONIST') && trainingWeek.userId !== userId) {
    const isAssigned = await isProfessionalAssignedToStudent(
      userId,
      trainingWeek.userId,
      role
    )

    // if (!isAssigned) {
    //   return reply.status(403).send({ message: 'You are not assigned to this student' })
    // }
  }

  return reply.send(trainingWeek)
}
