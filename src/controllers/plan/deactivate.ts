import { User } from '@prisma/client';
import { ClientError } from '@/errors/client-error';
import { FastifyRequest } from 'fastify';
import { deactivatePlanService } from '@/services/plan/deactivate-plan';
import { getPlanByIdService } from '@/services/plan/get-by-id';

export async function deactivatePlanController(
  request: FastifyRequest<{ Params: { id: string } }>
) {
  try {
    const { id } = request.params;
    const user = request.user as User;

    const plan = await getPlanByIdService(id);
    if (!plan) {
      throw new ClientError('Plan not found');
    }

    if (plan.professional.id !== user.id) {
      throw new ClientError('You can only deactivate your own plans');
    }

    const deactivatedPlan = await deactivatePlanService(id);

    return deactivatedPlan;
  } catch (error) {
    throw error;
  }
}
