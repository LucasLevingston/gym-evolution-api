import type { FastifyInstance } from 'fastify';
import * as notificationController from '@/presentation/http/controllers/notification';
import {
  createNotificationSchema,
  updateNotificationSchema,
  notificationParamsSchema,
  userIdParamsSchema,
  notificationQuerySchema,
} from '@/presentation/http/schemas/notification-schema';

export async function notificationRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      schema: {
        tags: ['notifications'],
        description: 'Create a new notification',
      },
    },
    notificationController.createNotificationController
  );

  fastify.get(
    '/:id',
    {
      schema: {
        params: notificationParamsSchema,

        tags: ['notifications'],
        description: 'Get a notification by ID',
      },
    },
    notificationController.getNotificationByIdController
  );

  fastify.get(
    '/',
    {
      schema: {
        tags: ['notifications'],
        description: 'Get notifications by user ID',
      },
    },
    notificationController.getNotificationsController
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        params: notificationParamsSchema,

        tags: ['notifications'],
        description: 'Update a notification',
      },
    },
    notificationController.updateNotificationController
  );

  fastify.patch(
    '/mark-all-read/:userId',
    {
      schema: {
        params: userIdParamsSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
        tags: ['notifications'],
        description: 'Mark all notifications as read for a user',
      },
    },
    notificationController.markAllAsReadController
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: notificationParamsSchema,

        tags: ['notifications'],
        description: 'Delete a notification',
      },
    },
    notificationController.deleteNotificationController
  );

  fastify.delete(
    '/clear-all/:userId',
    // {
    //   schema: {
    //     params: userIdParamsSchema,
    //     response: {
    //       200: {
    //         type: 'object',
    //         properties: {
    //           success: { type: 'boolean' },
    //           message: { type: 'string' },
    //         },
    //       },
    //     },
    //     tags: ['notifications'],
    //     description: 'Delete all notifications for a user',
    //   },
    // },
    notificationController.deleteAllNotificationsController
  );

  fastify.get(
    '/unread-count/:userId',
    {
      schema: {
        params: userIdParamsSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              count: { type: 'number' },
            },
          },
        },
        tags: ['notifications'],
        description: 'Get unread notification count for a user',
      },
    },
    notificationController.getUnreadCountController
  );
}
