import { prisma } from '@/infrastructure/database/prisma/client'
import { ClientError } from '@/domain/shared/errors/client-error'

export async function getMealItemById(id: string) {
  const mealItem = await prisma.mealItems.findUnique({
    where: { id },
  })

  if (!mealItem) {
    throw new ClientError('Meal item not found')
  }

  return mealItem
}
