import { prisma } from '@/infrastructure/database/prisma/client'

export async function approveProfessionalService(id: string) {
  return await prisma.user.update({
    where: { id },
    data: {
      approvalStatus: 'APPROVED',
    },
  })
}
