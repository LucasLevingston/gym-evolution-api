import { prisma } from '@/infrastructure/database/prisma/client'
import { ClientError } from '@/domain/shared/errors/client-error'

export async function getMealById(id: string) {
  const meal = await prisma.meal.findUnique({
    where: { id },
    include: {
      mealItems: true,
    },
  })

  if (!meal) {
    throw new ClientError('Meal not found')
  }

  return meal
}
