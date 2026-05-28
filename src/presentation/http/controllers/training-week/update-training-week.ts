import type { FastifyReply, FastifyRequest } from 'fastify'
import { getTrainingWeekById } from '@/application/training/get-training-week-by-id'
import { updateTrainingWeek } from '@/application/training/update-training-week'
import { isTrainerAssignedToStudent } from '@/application/training/is-trainer-assigned-to-student'
import { User } from '@prisma/client'

interface Params {
  id: string
}

interface Body {
  weekNumber?: number
  information?: string
  current?: boolean
  done?: boolean
}

export async function updateTrainingWeekController(
  request: FastifyRequest<{
    Params: Params
    Body: Body
  }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const { id: userId, role } = request.user as User
  const updateData = request.body

  const trainingWeek = await getTrainingWeekById(id)

  if (role === 'STUDENT' && trainingWeek.userId !== userId) {
    return reply.status(403).send({ message: 'Forbidden' })
  }

  if (role === 'TRAINER' && trainingWeek.userId !== userId) {
    const isAssigned = await isTrainerAssignedToStudent(userId, trainingWeek.userId)

    if (!isAssigned) {
      return reply.status(403).send({ message: 'You are not assigned to this student' })
    }
  }

  const updatedTrainingWeek = await updateTrainingWeek(id, updateData)

  return reply.send(updatedTrainingWeek)
}
