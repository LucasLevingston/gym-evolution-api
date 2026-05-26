import { User } from '@prisma/client';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { getConnectionStatus } from '@/application/auth/get-status';

export async function getStatus(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id: userId } = request.user as User;

    if (!userId) {
      return reply.code(401).send({ error: 'Authentication required' });
    }

    const status = await getConnectionStatus(userId);

    return status;
  } catch (error) {
    throw error;
  }
}
