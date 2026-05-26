import { prisma } from '@/infrastructure/database/prisma/client';

export async function deleteAllNotificationsService(userId: string) {
  return prisma.notification.deleteMany({
    where: { userId },
  });
}
