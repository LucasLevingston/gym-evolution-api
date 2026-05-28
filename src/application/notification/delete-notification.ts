import { prisma } from '@/infrastructure/database/prisma/client';

export async function deleteNotificationService(id: string) {
  return prisma.notification.delete({
    where: { id },
  });
}
