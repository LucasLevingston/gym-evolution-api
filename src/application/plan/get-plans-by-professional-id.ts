import { prisma } from '@/infrastructure/database/prisma/client'

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
