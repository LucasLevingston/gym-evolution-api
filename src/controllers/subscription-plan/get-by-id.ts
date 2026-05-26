import { ClientError } from '@/errors/client-error'
import type { FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma'

export async function getSubscriptionPlanByIdController(
  request: FastifyRequest<{ Params: { id: string } }>
) {
  const { id } = request.params
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id } })
  if (!plan) throw new ClientError('Subscription plan not found')

  return { ...plan, features: JSON.parse(plan.features) as string[] }
}
