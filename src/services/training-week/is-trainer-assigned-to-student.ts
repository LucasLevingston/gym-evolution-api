import { prisma } from '../../lib/prisma'

export async function isTrainerAssignedToStudent(
  trainerId: string,
  studentId: string
) {
  const purchase = await prisma.purchase.findFirst({
    where: {
      professionalId: trainerId,
      buyerId: studentId,
      status: 'ACTIVE',
    },
  })

  return !!purchase
}
