import { prisma } from '@/infrastructure/database/prisma/client'

export async function getPurchasesByProfessionalIdService(id: string) {
  return await prisma.purchase.findMany({
    where: { professionalId: id },
    include: {
      professional: true,
      Plan: { include: { features: true } },
      buyer: true,
    },
  })
}
