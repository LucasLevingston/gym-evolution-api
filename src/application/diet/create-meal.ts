import { prisma } from '@/infrastructure/database/prisma/client'
import { createHistoryEntry } from '@/application/history/create-history-entry'
import { MealTypeEnum } from '@prisma/client'

interface CreateMealParams {
  name: string
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  mealType?: MealTypeEnum
  day?: number
  hour?: string
  dietId: string
}

export async function createMeal(data: CreateMealParams, studentId: string) {
  // Create the meal
  const meal = await prisma.meal.create({
    data,
  })

  // Create history entry
  await createHistoryEntry(studentId, `Meal ${data.name} added to diet`)

  return meal
}
