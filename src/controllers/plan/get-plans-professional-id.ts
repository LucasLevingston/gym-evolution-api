import { FastifyRequest } from 'fastify';
import { getPlansByProfessionalIdService } from '@/services/plan/get-plans-by-professional-id';

export async function getPlansByProfessionalIdController(
  request: FastifyRequest<{ Params: { professionalId: string } }>
) {
  try {
    const { professionalId } = request.params;
    const plans = await getPlansByProfessionalIdService(professionalId);
    return plans;
  } catch (error) {
    throw error;
  }
}
