import { ClientError } from '@/domain/shared/errors/client-error';
import { FastifyRequest } from 'fastify';
import { PurchaseParams } from '@/presentation/http/schemas/purchase-schema';
import { createNotificationService } from '@/application/notification';
import { completePurchaseService } from '@/application/purchase/complete-purchase';
import { getPurchaseByIdService } from '@/application/purchase/get-by-id';

export async function completePurchaseController(
  request: FastifyRequest<{
    Params: PurchaseParams;
    Body: { paymentMethod: string; paymentId: string };
  }>
) {
  try {
    const { id } = request.params;
    const { paymentMethod, paymentId } = request.body;
    const purchase = await getPurchaseByIdService(id);

    if (!purchase) {
      throw new ClientError('Purchase not found');
    }

    const completedPurchase = await completePurchaseService(id, paymentMethod, paymentId);

    await createNotificationService({
      title: 'Pagamento Confirmado',
      message: `Seu pagamento para o plano ${purchase.Plan.name} foi confirmado.`,
      type: 'success',
      userId: purchase.buyerId,
    });

    await createNotificationService({
      title: 'Novo Pagamento',
      message: `Um pagamento de ${purchase.buyer.name} foi confirmado.`,
      type: 'success',
      userId: purchase.professionalId,
    });

    return completedPurchase;
  } catch (error) {
    throw error;
  }
}
