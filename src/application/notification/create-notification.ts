import type { CreateNotificationInput } from '@/presentation/http/schemas/notification-schema';
import { prisma } from '@/infrastructure/database/prisma/client';

export async function createNotificationService(data: CreateNotificationInput) {
  return prisma.notification.create({
    data,
  });
}
