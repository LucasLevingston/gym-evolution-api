import { prisma } from '@/lib/prisma';

export async function getUnreadCountService(userId: string) {
  return prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  });
}
