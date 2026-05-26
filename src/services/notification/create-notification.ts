import type { CreateNotificationInput } from '../../schemas/notification-schema';
import { prisma } from '@/lib/prisma';

export async function createNotificationService(data: CreateNotificationInput) {
  return prisma.notification.create({
    data,
  });
}
