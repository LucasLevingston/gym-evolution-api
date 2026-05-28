import { prisma } from '@/lib/prisma'

export async function deactivatePlanService(id: string) {
  return await prisma.plan.update({
    where: { id },
    data: { isActive: false },
  })
}
