import type { FastifyRequest } from 'fastify'
import { createTrainingWeek } from '@/application/training/create-training-week'
import { isTrainerAssignedToStudent } from '@/application/training/is-trainer-assigned-to-student'
import { ClientError } from '@/domain/shared/errors/client-error'
import { DayOfWeekEnum, User } from '@prisma/client'

interface Exercise {
  name: string
  variation?: string
  repetitions: number
  sets: number
  isCompleted?: boolean
  group: string
}

interface TrainingDay {
  muscleGroups: string[]
  dayOfWeek: DayOfWeekEnum
  comments?: string
  isCompleted?: boolean
  exercises?: Exercise[]
}

interface Body {
  weekNumber: number
  information?: string
  studentId?: string
  trainingDays: TrainingDay[]
  startDate: Date
  endDate: Date
}

export async function createTrainingWeekController(
  request: FastifyRequest<{
    Body: Body
  }>
) {
  try {
    const { id: userId, role } = request.user as User
    const { weekNumber, information, studentId, trainingDays, startDate, endDate } =
      request.body

    let targetUserId = userId

    if (role === 'TRAINER' && studentId) {
      const isAssigned = await isTrainerAssignedToStudent(userId, studentId)

      if (!isAssigned) {
        throw new ClientError('You are not assigned to this student')
      }

      targetUserId = studentId
    } else if (studentId && role !== 'STUDENT') {
      throw new ClientError('Only trainers can create training weeks for students')
    }

    const trainingWeek = await createTrainingWeek({
      weekNumber,
      information,
      userId: targetUserId,
      trainingDays,
      startDate,
      endDate,
    })

    return trainingWeek
  } catch (error) {
    throw error
  }
}
