import type { FastifyRequest } from 'fastify';
import { retryPaymentService } from '@/application/purchase/retry-purchase';

interface RetryPaymentParams {
  id: string;
}

interface RetryPaymentBody {
  paymentMethod: string;
  successUrl: string;
  cancelUrl: string;
}

export async function retryPaymentController(
  request: FastifyRequest<{
    Params: RetryPaymentParams;
    Body: RetryPaymentBody;
  }>
) {
  const { id } = request.params;
  const { paymentMethod, successUrl, cancelUrl } = request.body;

  const result = await retryPaymentService(id, paymentMethod, successUrl, cancelUrl);

  return result;
}
