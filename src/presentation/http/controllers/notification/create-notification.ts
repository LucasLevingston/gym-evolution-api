import type { FastifyRequest } from 'fastify';
import * as notificationService from '@/application/notification';
import type { CreateNotificationInput } from '@/presentation/http/schemas/notification-schema';

export async function createNotificationController(
  request: FastifyRequest<{ Body: CreateNotificationInput }>
) {
  try {
    const notification = await notificationService.createNotificationService(
      request.body
    );
    return { statusCode: 201, body: notification };
  } catch (error) {
    throw error;
  }
}
