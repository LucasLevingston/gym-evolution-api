import { prisma } from '@/lib/prisma'

export async function getPlanByIdService(id: string): Promise<any> {
  return await prisma.plan.findUnique({
    where: { id },
    include: {
      features: true,
      professional: true,
    },
  })
}
