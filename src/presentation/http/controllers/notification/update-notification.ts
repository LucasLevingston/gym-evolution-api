import type { FastifyRequest } from 'fastify';
import * as notificationService from '@/application/notification';
import type {
  NotificationParams,
  UpdateNotificationInput,
} from '@/presentation/http/schemas/notification-schema';

export async function updateNotificationController(
  request: FastifyRequest<{ Params: NotificationParams; Body: UpdateNotificationInput }>
) {
  try {
    const { id } = request.params;
    const notification = await notificationService.getNotificationByIdService(id);

    if (!notification) {
      return { statusCode: 404, body: { error: 'Notification not found' } };
    }

    const updatedNotification = await notificationService.updateNotificationService(
      id,
      request.body
    );

    return { statusCode: 200, body: updatedNotification };
  } catch (error) {
    throw error;
  }
}
