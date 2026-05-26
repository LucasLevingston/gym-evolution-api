import { User } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { generateAuthUrl, generateLoginAuthUrl } from '@/application/auth/auth';

export async function getAuthUrl(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = request.user as User;

    if (!user || !user.id) {
      const authUrl = await generateLoginAuthUrl();
      return reply.send({ authUrl });
    }

    const authUrl = await generateAuthUrl(user.id);
    reply.send({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}
