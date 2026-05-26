import { prisma } from '@/infrastructure/database/prisma/client';
import { UpdatePurchaseInput } from '@/presentation/http/schemas/purchase-schema';

export async function updatePurchaseService(id: string, data: UpdatePurchaseInput) {
  const purchase = await prisma.purchase.update({
    where: { id },
    data,
  });

  return purchase;
}
