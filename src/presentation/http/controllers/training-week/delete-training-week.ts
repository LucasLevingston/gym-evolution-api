import type { FastifyReply, FastifyRequest } from 'fastify'
import { getTrainingWeekById } from '@/application/training/get-training-week-by-id'
import { deleteTrainingWeek } from '@/application/training/delete-training-week'
import { isTrainerAssignedToStudent } from '@/application/training/is-trainer-assigned-to-student'
import { User } from '@prisma/client'

interface Params {
  id: string
}

export async function deleteTrainingWeekController(
  request: FastifyRequest<{
    Params: Params
  }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const { id: userId, role } = request.user as User

  const trainingWeek = await getTrainingWeekById(id)

  // Only trainers and admins can delete training weeks
  // if (role !== 'TRAINER' && role !== 'ADMIN') {
  //   return reply.status(403).send({ message: 'Forbidden' });
  // }

  // If a trainer is trying to delete a student's training week
  if (role === 'TRAINER' && trainingWeek.userId !== userId) {
    // Check if the trainer is assigned to this student
    const isAssigned = await isTrainerAssignedToStudent(userId, trainingWeek.userId)

    if (!isAssigned) {
      return reply.status(403).send({ message: 'You are not assigned to this student' })
    }
  }

  await deleteTrainingWeek(id)

  return reply.send({ message: 'Training week deleted successfully' })
}
