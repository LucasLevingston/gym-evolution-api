import { prisma } from '@/lib/prisma';
import { UpdatePurchaseInput } from '@/schemas/purchase-schema';

export async function updatePurchaseService(id: string, data: UpdatePurchaseInput) {
  const purchase = await prisma.purchase.update({
    where: { id },
    data,
  });

  return purchase;
}
