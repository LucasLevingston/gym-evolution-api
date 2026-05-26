import type { History } from '@prisma/client'

export interface IHistoryRepository {
  findByUserId(userId: string): Promise<History[]>
  create(data: { event: string; date: string; userId: string }): Promise<History>
  delete(id: string): Promise<void>
}
