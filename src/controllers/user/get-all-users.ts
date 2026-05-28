import type { FastifyReply, FastifyRequest } from 'fastify';
import { getAllUsers } from '../../services/user/get-all-users';
import { User } from '@prisma/client';
import { ClientError } from '@/errors/client-error';

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
