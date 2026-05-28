import { prisma } from '../../lib/prisma'

export async function getTrainerStudents(trainerId: string) {
  const purchases = await prisma.purchase.findMany({
    where: {
      professionalId: trainerId,
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
