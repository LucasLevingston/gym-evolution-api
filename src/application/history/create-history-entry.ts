import { prisma } from '@/infrastructure/database/prisma/client'

export async function createHistoryEntry(userId: string, event: string) {
  return prisma.history.create({
    data: {
      event,
      date: new Date().toISOString(),
      userId,
    },
  })
}
