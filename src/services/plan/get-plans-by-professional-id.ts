import { prisma } from '@/lib/prisma'

export async function getPlansByProfessionalIdService(professionalId: string) {
  return await prisma.plan.findMany({
    where: {
      professionalId,
      isActive: true,
    },
    orderBy: {
      price: 'asc',
    },
    include: {
      features: true,
      professional: true,
    },
  })
}
