import { ClientError } from '@/domain/shared/errors/client-error';
import { FastifyRequest } from 'fastify';
import { PurchaseParams, UpdatePurchaseInput } from '@/presentation/http/schemas/purchase-schema';
import { createNotificationService } from '@/application/notification';
import { getPurchaseByIdService } from '@/application/purchase/get-by-id';
import { updatePurchaseService } from '@/application/purchase/update';

export async function updatePurchaseController(
  request: FastifyRequest<{ Params: PurchaseParams; Body: UpdatePurchaseInput }>
) {
  try {
    const { id } = request.params;
    const purchase = await getPurchaseByIdService(id);

    if (!purchase) {
      throw new ClientError('Purchase not found');
    }

    const updatedPurchase = await updatePurchaseService(id, request.body);

    if (request.body.status === 'CANCELLED') {
      await createNotificationService({
        title: 'Compra Cancelada',
        message: `Sua compra do plano ${purchase.Plan.name} foi cancelada.`,
        type: 'info',
        userId: purchase.buyerId,
      });

      await createNotificationService({
        title: 'Compra Cancelada',
        message: `Uma solicitação de ${purchase.buyer.name} foi cancelada.`,
        type: 'info',
        userId: purchase.professionalId,
      });
    }

    return updatedPurchase;
  } catch (error) {
    throw error;
  }
}
