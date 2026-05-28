import { prisma } from '@/infrastructure/database/prisma/client'
import { createHistoryEntry } from '@/application/history/create-history-entry'
import { ClientError } from '@/domain/shared/errors/client-error'

export async function deleteMeal(id: string) {
  const meal = await prisma.meal.findUnique({
    where: { id },
    include: {
      Diet: true,
    },
  })

  if (!meal || !meal.Diet) {
    throw new ClientError('Meal not found')
  }

  // Delete the meal
  await prisma.meal.delete({
    where: { id },
  })

  // Create history entry
  await createHistoryEntry(meal.Diet.userId!, `Meal ${meal.name} deleted`)

  return true
}
