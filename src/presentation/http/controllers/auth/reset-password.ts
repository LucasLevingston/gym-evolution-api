import { ClientError } from '@/domain/shared/errors/client-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { resetPasswordService } from '@/application/auth/reset-password';
import { createHistoryEntry } from '@/application/history/create-history-entry';
import { getUserByToken } from '@/application/user/get-user-by-token';
import { hashPassword } from '@/shared/utils/jwt';

export async function resetPasswordController(
  request: FastifyRequest<{ Body: { password: string; token: string } }>,
  reply: FastifyReply
) {
  try {
    const { password, token } = request.body;
    const user = await getUserByToken(token);
    if (!user) {
      throw new ClientError('User not exists');
    }

    const hashedPassword = await hashPassword(password);

    await resetPasswordService(user.id, hashedPassword);

    await createHistoryEntry(user.id, 'Password reset');

    reply.code(200).send({ message: 'Password reset successful' });
  } catch (error) {
    throw error;
  }
}
