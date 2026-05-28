import type { User } from '@prisma/client'
import { ClientError } from '@/errors/client-error'
import type { FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma'

export async function deleteSubscriptionPlanController(
  request: FastifyRequest<{ Params: { id: string } }>
) {
  const user = request.user as User
  if (user.role !== 'ADMIN') throw new ClientError('Only admins can manage subscription plans')

  const { id } = request.params
  await prisma.subscriptionPlan.update({
    where: { id },
    data: { isActive: false },
  })

  return { message: 'Plan deactivated' }
}
