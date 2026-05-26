import { prisma } from '@/infrastructure/database/prisma/client'

export async function rejectProfessionalService(id: string) {
  return await prisma.user.update({
    where: { id },
    data: {
      approvalStatus: 'REJECTED',
    },
  })
}
