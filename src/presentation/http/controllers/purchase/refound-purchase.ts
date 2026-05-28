// import { ClientError } from '@/domain/shared/errors/client-error';
// import { FastifyRequest } from 'fastify';
// import { PurchaseParams } from '@/presentation/http/schemas/purchase-schema';
// import { createNotificationService } from '@/application/notification';
// import { getPurchaseByIdService } from '@/application/purchase/get-by-id';
// import { refundPurchaseService } from '@/application/purchase/refound-purchase';

// export async function refundPurchaseController(
//   request: FastifyRequest<{ Params: PurchaseParams }>
// ) {
//   try {
//     const { id } = request.params;
//     const purchase = await getPurchaseByIdService(id);

//     if (!purchase) {
//       throw new ClientError('Purchase not found');
//     }

//     const refundedPurchase = await refundPurchaseService(id);

//     await createNotificationService({
//       title: 'Reembolso Processado',
//       message: `Seu reembolso para o plano ${purchase.planName} foi processado.`,
//       type: 'info',
//       userId: purchase.buyerId,
//     });

//     await createNotificationService({
//       title: 'Reembolso Processado',
//       message: `Um reembolso para ${purchase.buyer.name} foi processado.`,
//       type: 'info',
//       userId: purchase.professionalId,
//     });

//     return refundedPurchase;
//   } catch (error) {
//     throw error;
//   }
// }
