import { User } from '@prisma/client'
import { ClientError } from '@/domain/shared/errors/client-error'
import { FastifyRequest } from 'fastify'
import { UpdatePlanInput } from '@/presentation/http/schemas/plan-schema'
import { getPlanByIdService } from '@/application/plan/get-by-id'
import { updatePlanService } from '@/application/plan/update-plan-service'

export async function updatePlanController(
  request: FastifyRequest<{ Params: { id: string }; Body: { plan: UpdatePlanInput } }>
) {
  try {
    const { id } = request.params
    const { plan } = request.body
    const user = request.user as User

    const planData = await getPlanByIdService(id)
    if (!planData) {
      throw new ClientError('Plan not found')
    }

    if (plan.professionalId !== user.id) {
      throw new ClientError('You can only update your own plans')
    }

    const updatedPlan = await updatePlanService(id, plan)

    return updatedPlan
  } catch (error) {
    throw error
  }
}
