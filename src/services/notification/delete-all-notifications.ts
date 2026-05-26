import { prisma } from '@/lib/prisma';

export async function deleteAllNotificationsService(userId: string) {
  return prisma.notification.deleteMany({
    where: { userId },
  });
}
