import type { Notification } from '@prisma/client'

export interface INotificationRepository {
  findById(id: string): Promise<Notification | null>
  findByUserId(userId: string, options?: {
    limit?: number
    offset?: number
    read?: boolean
  }): Promise<Notification[]>
  getUnreadCount(userId: string): Promise<number>
  create(data: Partial<Notification>): Promise<Notification>
  update(id: string, data: Partial<Notification>): Promise<Notification>
  delete(id: string): Promise<void>
  deleteAllByUserId(userId: string): Promise<void>
  markAllAsRead(userId: string): Promise<void>
}
