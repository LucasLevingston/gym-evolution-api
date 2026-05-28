import type { FastifyRequest } from 'fastify'
import { prisma } from '@/infrastructure/database/prisma/client'

export async function getAllSubscriptionPlansController(_request: FastifyRequest) {
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  })

  return plans.map((p) => ({
    ...p,
    features: JSON.parse(p.features) as string[],
  }))
}
