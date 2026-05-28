import type { FastifyRequest } from 'fastify';
import * as notificationService from '@/application/notification';
import type { NotificationParams } from '@/presentation/http/schemas/notification-schema';

export async function deleteNotificationController(
  request: FastifyRequest<{ Params: NotificationParams }>
) {
  try {
    const { id } = request.params;
    const notification = await notificationService.getNotificationByIdService(id);

    if (!notification) {
      return { statusCode: 404, body: { error: 'Notification not found' } };
    }

    const result = await notificationService.deleteNotificationService(id);
    return result;
  } catch (error) {
    throw error;
  }
}
