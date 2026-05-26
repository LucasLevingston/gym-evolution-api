import type { FastifyRequest } from 'fastify';
import * as notificationService from '@/application/notification';
import type { NotificationParams } from '@/presentation/http/schemas/notification-schema';

export async function getNotificationByIdController(
  request: FastifyRequest<{ Params: NotificationParams }>
) {
  try {
    const { id } = request.params;
    const notification = await notificationService.getNotificationByIdService(id);

    if (!notification) {
      return { statusCode: 404, body: { error: 'Notification not found' } };
    }

    return { statusCode: 200, body: notification };
  } catch (error) {
    throw error;
  }
}
