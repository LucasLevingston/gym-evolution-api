import { prisma } from '@/lib/prisma';

export async function getNotificationByIdService(id: string) {
  return prisma.notification.findUnique({
    where: { id },
  });
}
