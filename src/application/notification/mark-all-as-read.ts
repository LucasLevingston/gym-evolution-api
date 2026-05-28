import { prisma } from '@/infrastructure/database/prisma/client';

export async function markAllAsReadService(userId: string) {
  return prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
    },
  });
}
