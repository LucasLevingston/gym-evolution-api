import { prisma } from '@/infrastructure/database/prisma/client';
import type { UpdateNotificationInput } from '@/presentation/http/schemas/notification-schema';

export async function updateNotificationService(
  id: string,
  data: UpdateNotificationInput
) {
  return prisma.notification.update({
    where: { id },
    data,
  });
}
