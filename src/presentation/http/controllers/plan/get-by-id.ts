import { ClientError } from '@/domain/shared/errors/client-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getPlanByIdService } from '@/application/plan/get-by-id';

export async function getPlanByIdController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const plan = await getPlanByIdService(id);

    if (!plan) {
      throw new ClientError('Plan not found');
    }

    return reply.send(plan);
  } catch (error) {
    throw error;
  }
}
