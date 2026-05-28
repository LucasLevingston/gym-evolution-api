import { prisma } from '@/lib/prisma';

export async function deleteNotificationService(id: string) {
  return prisma.notification.delete({
    where: { id },
  });
}
