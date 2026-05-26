import { prisma } from '@/lib/prisma'

export async function approveProfessionalService(id: string) {
  return await prisma.user.update({
    where: { id },
    data: {
      approvalStatus: 'APPROVED',
    },
  })
}
