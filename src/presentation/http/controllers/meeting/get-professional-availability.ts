import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { getProfessionalAvailabilityService } from '@/application/meeting/get-professional-availability';

const paramsSchema = z.object({
  professionalId: z.string().uuid(),
});

const querystringSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

type RequestType = FastifyRequest<{
  Params: z.infer<typeof paramsSchema>;
  Querystring: z.infer<typeof querystringSchema>;
}>;

export async function getProfessionalAvailabilityController(
  request: RequestType,
  reply: FastifyReply
) {
  try {
    const { professionalId } = request.params;
    const { date } = request.query;

    if (!professionalId || !date) {
      return reply.code(400).send({
        error: 'Professional ID and date are required',
      });
    }

    const timeSlots = await getProfessionalAvailabilityService(professionalId, date);
    return reply.send(timeSlots);
  } catch (error) {
    throw error;
  }
}
