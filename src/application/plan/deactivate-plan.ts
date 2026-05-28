import { prisma } from '@/infrastructure/database/prisma/client'

export async function deactivatePlanService(id: string) {
  return await prisma.plan.update({
    where: { id },
    data: { isActive: false },
  })
}
