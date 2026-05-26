import { prisma } from '../../lib/prisma'

export async function getNutritionistStudents(nutritionistId: string) {
  const purchases = await prisma.purchase.findMany({
    where: {
      professionalId: nutritionistId,
      status: 'ACTIVE',
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
          sex: true,
          birthDate: true,
          currentWeight: true,
        },
      },
    },
  })

  return purchases
    .map((p) => p.buyer)
    .filter((student): student is NonNullable<typeof student> => student !== null)
}
