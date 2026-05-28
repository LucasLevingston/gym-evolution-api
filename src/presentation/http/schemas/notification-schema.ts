import { z } from 'zod';

export const notificationTypeEnum = z.enum(['success', 'error', 'info', 'default']);

export const createNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: notificationTypeEnum,
  link: z.string().optional(),
  userId: z.string().uuid('Invalid user ID format'),
});

export const updateNotificationSchema = z.object({
  read: z.boolean().optional(),
});

export const notificationParamsSchema = z.object({
  id: z.string().uuid('Invalid notification ID format'),
});

export const userIdParamsSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

export const notificationQuerySchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  limit: z.coerce.number().positive().optional(),
  offset: z.coerce.number().nonnegative().optional(),
  read: z.enum(['true', 'false']).optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
export type NotificationParams = z.infer<typeof notificationParamsSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type NotificationQuery = z.infer<typeof notificationQuerySchema>;
