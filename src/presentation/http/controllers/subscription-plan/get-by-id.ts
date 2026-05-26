import { ClientError } from '@/domain/shared/errors/client-error'
import type { FastifyRequest } from 'fastify'
import { prisma } from '@/infrastructure/database/prisma/client'

export async function getSubscriptionPlanByIdController(
  request: FastifyRequest<{ Params: { id: string } }>
) {
  const { id } = request.params
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id } })
  if (!plan) throw new ClientError('Subscription plan not found')

  return { ...plan, features: JSON.parse(plan.features) as string[] }
}
