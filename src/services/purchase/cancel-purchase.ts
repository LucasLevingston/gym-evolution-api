import { prisma } from '@/lib/prisma';

export async function cancelPurchaseService(
  id: string,
  reason: string,
  comment?: string
) {
  const purchase = await prisma.purchase.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      cancelReason: reason,
      cancelComment: comment,
      cancelledAt: new Date(),
    },
  });

  return purchase;
}
