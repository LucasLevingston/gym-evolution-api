import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authenticate } from '@/middlewares/authenticate';
import { errorResponseSchema } from '@/schemas/error-schema';
import { getUserCalendarController } from '@/controllers/meeting/get-user-calendar';
import { getProfessionalAvailabilityController } from '@/controllers/meeting/get-professional-availability';
import { createMeetingController } from '@/controllers/meeting';
import { createMeetingSchema, meetingSchema } from '@/schemas/meeting-schema';

const timeSlotSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  available: z.boolean(),
});

export async function meetingRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.addHook('onRequest', authenticate);

  server.get('/calendar', getUserCalendarController);

  server.get(
    '/availability/:professionalId',
    // {
    //   schema: {
    //     params: z.object({
    //       professionalId: z.string().uuid('Invalid professional ID format'),
    //     }),
    //     querystring: z.object({
    //       date: z
    //         .string()
    //         .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    //     }),
    //     response: {
    //       200: z.array(timeSlotSchema),
    //       400: errorResponseSchema,
    //       403: errorResponseSchema,
    //       404: errorResponseSchema,
    //       500: errorResponseSchema,
    //     },
    //     tags: ['meetings'],
    //     summary: 'Get professional availability',
    //     description: 'Get available time slots for a professional on a specific date',
    //   },
    // },
    getProfessionalAvailabilityController
  );

  server.post(
    '/meetings',
    {
      schema: {
        body: createMeetingSchema,
        response: {
          201: meetingSchema,
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['meetings'],
        summary: 'Create meeting',
        description: 'Create a new Google Meet meeting',
      },
    },
    createMeetingController
  );
}
