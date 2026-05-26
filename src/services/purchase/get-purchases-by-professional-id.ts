import { prisma } from '@/lib/prisma'

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
