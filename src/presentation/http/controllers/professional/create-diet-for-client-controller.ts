import type { FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createDietForClientService } from '@/application/professional/create-diet-for-client-service'
import type { User } from '@prisma/client'
import { ClientError } from '@/domain/shared/errors/client-error'

const createDietForClientBodySchema = z.object({
  weekNumber: z.number().int().positive(),
  totalCalories: z.number().int().optional(),
  totalProtein: z.number().optional(),
  totalCarbohydrates: z.number().optional(),
  totalFat: z.number().optional(),
  clientId: z.string().uuid(),
  purchaseId: z.string().uuid(),
  featureId: z.string().uuid(),
  meals: z.array(
    z.object({
      name: z.string(),
      mealType: z.string(),
      day: z.number().int(),
      hour: z.string(),
      calories: z.number().int().optional(),
      protein: z.number().optional(),
      carbohydrates: z.number().optional(),
      fat: z.number().optional(),
      mealItems: z.array(
        z.object({
          name: z.string(),
          quantity: z.number().int().positive(),
          quantityType: z.string().default('g'),
          calories: z.number().int().optional(),
          protein: z.number().optional(),
          carbohydrates: z.number().optional(),
          fat: z.number().optional(),
          isSubstitution: z.boolean().default(false),
          originalItemId: z.string().uuid().optional(),
        })
      ),
    })
  ),
})

export async function createDietForClientController(
  request: FastifyRequest<{ Body: { diet: any } }>
) {
  try {
    const { id: professionalId } = request.user as User
    const { diet } = request.body

    if (!diet) {
      throw new ClientError('Error on request body')
    }

    const {
      purchaseId,
      clientId,
      featureId,
      weekNumber,
      totalCalories,
      totalProtein,
      totalCarbohydrates,
      totalFat,
      meals,
    } = diet

    const data = await createDietForClientService({
      clientId,
      professionalId,
      purchaseId,
      featureId,
      weekNumber,
      totalCalories,
      totalProtein,
      totalCarbohydrates,
      totalFat,
      meals,
    })
    return data
  } catch (error) {
    throw error
  }
}
