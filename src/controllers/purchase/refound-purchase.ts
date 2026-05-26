// import { ClientError } from '@/errors/client-error';
// import { FastifyRequest } from 'fastify';
// import { PurchaseParams } from '@/schemas/purchase-schema';
// import { createNotificationService } from '@/services/notification';
// import { getPurchaseByIdService } from '@/services/purchase/get-by-id';
// import { refundPurchaseService } from '@/services/purchase/refound-purchase';

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
