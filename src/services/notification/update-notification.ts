import { prisma } from '@/lib/prisma';
import type { UpdateNotificationInput } from '../../schemas/notification-schema';

export async function updateNotificationService(
  id: string,
  data: UpdateNotificationInput
) {
  return prisma.notification.update({
    where: { id },
    data,
  });
}
