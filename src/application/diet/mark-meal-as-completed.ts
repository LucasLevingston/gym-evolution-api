import { prisma } from '@/infrastructure/database/prisma/client';

export async function markMealAsCompleted(id: string) {
  return await prisma.meal.update({
    where: { id },
    data: {
      isCompleted: true,
    },
    include: {
      Diet: true,
    },
  });
}
