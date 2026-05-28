import { prisma } from '@/lib/prisma';

export async function getNotificationsByUserIdService(
  userId: string,
  limit?: number,
  offset?: number,
  read?: boolean
) {
  const where = {
    userId,
    ...(read !== undefined ? { read } : {}),
  };

  return prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    ...(limit ? { take: limit } : {}),
    ...(offset ? { skip: offset } : {}),
  });
}
