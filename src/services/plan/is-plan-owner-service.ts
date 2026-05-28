import { prisma } from '@/lib/prisma'

export async function isPlanOwnerService(planId: string, professionalId: string) {
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    select: { professionalId: true },
  })

  return plan?.professionalId === professionalId
}
