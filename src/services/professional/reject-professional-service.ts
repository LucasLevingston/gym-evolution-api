import { prisma } from '@/lib/prisma'

export async function rejectProfessionalService(id: string) {
  return await prisma.user.update({
    where: { id },
    data: {
      approvalStatus: 'REJECTED',
    },
  })
}
