import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/infrastructure/database/prisma/client'
export async function createExerciseController(
  request: FastifyRequest<{
    Body: {
      name: string
      group: string
      variation?: string
      repetitions: number
      sets: number
      isCompleted?: boolean
      trainingDayId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const exercise = await prisma.exercise.create({
      data: request.body,
    })
    return reply.code(201).send(exercise)
  } catch (error) {
    throw error
  }
}
