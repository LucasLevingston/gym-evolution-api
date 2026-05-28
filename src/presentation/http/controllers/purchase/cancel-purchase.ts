import { ClientError } from '@/domain/shared/errors/client-error';
import { FastifyRequest } from 'fastify';
import { PurchaseParams } from '@/presentation/http/schemas/purchase-schema';
import { createNotificationService } from '@/application/notification';
import { cancelPurchaseService } from '@/application/purchase/cancel-purchase';
import { getPurchaseByIdService } from '@/application/purchase/get-by-id';

export async function cancelPurchaseController(
  request: FastifyRequest<{
    Params: PurchaseParams;
    Body: { reason: string; comment?: string };
  }>
) {
  try {
    const { id } = request.params;
    const { reason, comment } = request.body;
    const purchase = await getPurchaseByIdService(id);

    if (!purchase) {
      throw new ClientError('Purchase not found');
    }

    const cancelledPurchase = await cancelPurchaseService(id, reason, comment);

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

    return cancelledPurchase;
  } catch (error) {
    throw error;
  }
}
