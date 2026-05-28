import { prisma } from '@/infrastructure/database/prisma/client';

export async function getUnreadCountService(userId: string) {
  return prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  });
}
