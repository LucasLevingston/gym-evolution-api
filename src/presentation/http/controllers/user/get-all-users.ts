import type { FastifyReply, FastifyRequest } from 'fastify';
import { getAllUsers } from '@/application/user/get-all-users';
import { User } from '@prisma/client';
import { ClientError } from '@/domain/shared/errors/client-error';

export async function getAllUsersController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { role } = request.user as User;

    if (role !== 'ADMIN') {
      throw new ClientError('Forbidden');
    }

    const users = await getAllUsers();

    return reply.send(users);
  } catch (error) {
    throw error;
  }
}
