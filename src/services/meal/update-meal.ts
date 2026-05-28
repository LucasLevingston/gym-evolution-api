import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { ClientError } from '../../errors/client-error'
import { MealTypeEnum } from '@prisma/client'

interface UpdateMealParams {
  name?: string
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  mealType?: MealTypeEnum
  day?: number
  hour?: string
}

export async function updateMeal(id: string, data: UpdateMealParams) {
  const meal = await prisma.meal.findUnique({
    where: { id },
    include: {
      Diet: true,
    },
  })

  if (!meal || !meal.Diet) {
    throw new ClientError('Meal not found')
  }

  // Update the meal
  const updatedMeal = await prisma.meal.update({
    where: { id },
    data,
  })

  // Create history entry
  await createHistoryEntry(meal.Diet.userId!, `Meal ${meal.name} updated`)

  return updatedMeal
}
