import type { FastifyRequest } from 'fastify';
import { verifyToken } from '@/shared/utils/jwt';
import { ClientError } from '@/domain/shared/errors/client-error';
import { getUserByIdService } from '@/application/user/get-user-by-id';

export const authenticate = async (request: FastifyRequest) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ClientError('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new ClientError('Token is missing');
    }

    const payload = verifyToken(token);
    const tokenUserId = payload.userId;

    if (!tokenUserId || typeof tokenUserId !== 'string') {
      throw new ClientError('Invalid token');
    }

    const user = await getUserByIdService(tokenUserId);

    if (!user) {
      throw new ClientError('User not found');
    }

    request.user = user;
  } catch (error: any) {
    throw new ClientError(error.message);
  }
};
