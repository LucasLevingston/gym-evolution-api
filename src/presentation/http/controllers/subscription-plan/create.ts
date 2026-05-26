import type { User } from '@prisma/client'
import { ClientError } from '@/domain/shared/errors/client-error'
import type { FastifyRequest } from 'fastify'
import { prisma } from '@/infrastructure/database/prisma/client'
import { z } from 'zod'

const createSubscriptionPlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  interval: z.enum(['month', 'year']).default('month'),
  features: z.array(z.string()).min(1),
})

export async function createSubscriptionPlanController(
  request: FastifyRequest<{ Body: z.infer<typeof createSubscriptionPlanSchema> }>
) {
  const user = request.user as User
  if (user.role !== 'ADMIN') throw new ClientError('Only admins can manage subscription plans')

  const data = createSubscriptionPlanSchema.parse(request.body)

  const plan = await prisma.subscriptionPlan.create({
    data: {
      ...data,
      features: JSON.stringify(data.features),
    },
  })

  return plan
}
