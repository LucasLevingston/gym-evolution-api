import type { User } from '@prisma/client'
import { ClientError } from '@/domain/shared/errors/client-error'
import type { FastifyRequest } from 'fastify'
import { prisma } from '@/infrastructure/database/prisma/client'
import { z } from 'zod'

const updateSubscriptionPlanSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  interval: z.enum(['month', 'year']).optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

export async function updateSubscriptionPlanController(
  request: FastifyRequest<{
    Params: { id: string }
    Body: z.infer<typeof updateSubscriptionPlanSchema>
  }>
) {
  const user = request.user as User
  if (user.role !== 'ADMIN') throw new ClientError('Only admins can manage subscription plans')

  const { id } = request.params
  const data = updateSubscriptionPlanSchema.parse(request.body)

  const plan = await prisma.subscriptionPlan.update({
    where: { id },
    data: {
      ...data,
      features: data.features ? JSON.stringify(data.features) : undefined,
    },
  })

  return { ...plan, features: JSON.parse(plan.features) as string[] }
}
