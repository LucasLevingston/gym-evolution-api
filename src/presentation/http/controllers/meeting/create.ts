import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { createMeetingService } from '@/application/meeting/create';
import { User } from '@prisma/client';
import { ClientError } from '@/domain/shared/errors/client-error';

const createMeetingBodySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  purchaseId: z.string().uuid(),
  professionalId: z.string().uuid(),
  professionalEmail: z.string().email(),
  studentId: z.string().uuid(),
  attendees: z.array(z.string().email()).optional(),
});

type CreateMeetingRequest = FastifyRequest<{
  Body: z.infer<typeof createMeetingBodySchema>;
}>;

export async function createMeetingController(
  request: CreateMeetingRequest,
  reply: FastifyReply
) {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      purchaseId,
      professionalId,
      professionalEmail,
      studentId,
      attendees,
    } = request.body;

    const { id } = request.user as User;

    if (id !== studentId) {
      throw new ClientError('Forbidden');
    }

    const meeting = await createMeetingService({
      title,
      description,
      startTime,
      endTime,
      purchaseId,
      professionalId,
      professionalEmail,
      studentId,
      attendees,
      userId: id,
    });

    return reply.status(201).send(meeting);
  } catch (error) {
    throw error;
  }
}
