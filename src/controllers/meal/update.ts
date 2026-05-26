import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma'
import { MealTypeEnum } from '@prisma/client'
export async function updateMealController(
  request: FastifyRequest<{
    Params: { id: string }
    Body: {
      name?: string
      calories?: number
      protein?: number
      carbohydrates?: number
      fat?: number
      mealType?: MealTypeEnum
      day?: number
      hour?: string
      isCompleted?: boolean
    }
  }>,
  reply: FastifyReply
) {
  try {
    const meal = await prisma.meal.update({
      where: { id: request.params.id },
      data: request.body,
    })
    return reply.send(meal)
  } catch (error) {
    throw error
  }
}
