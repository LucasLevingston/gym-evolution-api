import type { User } from '@prisma/client'
import { ClientError } from '@/domain/shared/errors/client-error'
import type { FastifyRequest } from 'fastify'
import { type CreatePlanInput, getPredefinedFeatures } from '@/presentation/http/schemas/plan-schema'
import { createPlanService } from '@/application/plan/create'

export async function createPlanController(
  request: FastifyRequest<{ Body: { plan: CreatePlanInput } }>
) {
  try {
    const user = request.user as User
    const { plan } = request.body

    if (user.role !== 'NUTRITIONIST' && user.role !== 'TRAINER') {
      throw new ClientError('Only professionals can create plans')
    }

    if (user.id !== plan.professionalId) {
      throw new ClientError('You can only create plans for yourself')
    }

    const result = await createPlanService(plan)

    return result
  } catch (error) {
    throw error
  }
}
