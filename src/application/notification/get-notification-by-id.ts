import { prisma } from '@/infrastructure/database/prisma/client';

export async function getNotificationByIdService(id: string) {
  return prisma.notification.findUnique({
    where: { id },
  });
}
