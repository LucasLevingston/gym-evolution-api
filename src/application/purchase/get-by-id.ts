import { prisma } from '@/infrastructure/database/prisma/client'

export async function getPurchaseByIdService(id: string) {
  return prisma.purchase.findUnique({
    where: { id },
    include: {
      buyer: true,
      professional: true,
      Plan: { include: { features: true } },
    },
  })
}
