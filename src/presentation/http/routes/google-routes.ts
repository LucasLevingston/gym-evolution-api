import { getAuthUrl } from '@/presentation/http/controllers/auth/auth';
import { googleCallbackController } from '@/presentation/http/controllers/auth/callback';
import { getStatus } from '@/presentation/http/controllers/google-auth/get-status';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authenticate } from '@/presentation/http/middlewares/authenticate';

export async function googleRoutes(app: FastifyInstance): Promise<void> {
  const server = app.withTypeProvider<ZodTypeProvider>();
  server.addHook('onRequest', async (request) => {
    if (request.originalUrl.startsWith('/google/callback')) {
      return;
    }
    await authenticate(request);
  });
  server.get('/auth', getAuthUrl);

  // server.post('/token', googleTokenController.exchangeToken);
  server.get('/callback', googleCallbackController);
  server.get('/status', getStatus);

  // server.post('/disconnect', googleDisconnectController.disconnect);
}
