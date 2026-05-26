import { prisma } from '@/infrastructure/database/prisma/client'

export async function isProfessionalAssignedToStudent(
  professionalId: string,
  studentId: string,
  _role: string
) {
  // Check if there's an active purchase from the student to this professional
  const purchase = await prisma.purchase.findFirst({
    where: {
      professionalId,
      buyerId: studentId,
      status: 'ACTIVE',
    },
  })

  return !!purchase
}
