import type { FastifyReply, FastifyRequest } from 'fastify';
import { getCurrentUser } from '@/application/auth/get-current-user';
import { User } from '@prisma/client';

export async function getCurrentUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id: userId } = request.user as User;

  const user = await getCurrentUser(userId);

  return reply.send(user);
}
