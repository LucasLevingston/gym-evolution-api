import { User } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getUserCalendarService } from '@/application/meeting/get-user-calendar';

export async function getUserCalendarController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id: userId } = request.user as User;

    if (!userId) {
      return reply.code(401).send({
        error: 'Authentication required',
      });
    }

    const calendarEvents = await getUserCalendarService(userId);
    return reply.send(calendarEvents);
  } catch (error) {
    throw error;
  }
}
