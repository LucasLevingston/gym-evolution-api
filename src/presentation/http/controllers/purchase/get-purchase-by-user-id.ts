import { FastifyRequest } from 'fastify';
import { PurchaseQuery } from '@/presentation/http/schemas/purchase-schema';
import { getPurchasesByUserIdService } from '@/application/purchase/get-by-user-id';

export async function getPurchasesByUserIdController(
  request: FastifyRequest<{ Querystring: PurchaseQuery; Params: { userId: string } }>
) {
  try {
    const { userId } = request.params;

    const purchases = await getPurchasesByUserIdService(userId);

    return purchases;
  } catch (error) {
    throw error;
  }
}
