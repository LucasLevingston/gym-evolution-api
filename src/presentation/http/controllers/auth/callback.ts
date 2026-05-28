import type { FastifyReply, FastifyRequest } from 'fastify';
import { oauth2Client } from '@/infrastructure/external/google/oauth2-client';
import { callbackGoogleService } from '@/application/auth/callback';
import { env } from '@/env';
import { ClientError } from '@/domain/shared/errors/client-error';
import { createNotificationService } from '@/application/notification';

export async function googleCallbackController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { code, state } = request.query as { code: string; state: string };
  const { BACKEND_URL, FRONTEND_URL } = env;

  if (!code || !state) {
    return reply.redirect(`${FRONTEND_URL}/connect-google?error=invalid_request`);
  }

  try {
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: `${BACKEND_URL}/google/callback`,
    });

    if (state === 'login') {
      const result = await callbackGoogleService({ state, tokens });

      if (!result.token) throw new ClientError('Error on create callback');

      reply.setCookie('token', result.token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60,
      });

      if (result.isNewUser) {
        createNotificationService({
          userId: result.user.id,
          title: 'Welcome!',
          message: 'Your account has been created successfully.',
          type: 'success',
        });
        return reply.redirect(
          `${FRONTEND_URL}/onboarding?source=google&token=${result.token}&userId=${result.user.id}`
        );
      }
      if (!result.isNewUser && result.user?.id) {
        return reply.redirect(
          `${FRONTEND_URL}/?token=${result.token}&userId=${result.user.id}`
        );
      }
    } else {
      await callbackGoogleService({ state, tokens });

      return reply.redirect(`${FRONTEND_URL}/settings/connect-google?success=true`);
    }
  } catch (error) {
    console.error('Google callback error:', error);

    if (state === 'login') {
      return reply.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
    }
    return reply.redirect(`${FRONTEND_URL}/settings/connect-google?error=auth_failed`);
  }
}
