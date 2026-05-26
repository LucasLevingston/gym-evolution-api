import type { FastifyRequest } from 'fastify'
import { createFeedbackForClientService } from '@/application/professional/create-feedback-for-client'

export async function createFeedbackForClientController(
  request: FastifyRequest<{ Body: { featureId: string; feedback: string } }>
) {
  try {
    const { featureId, feedback } = request.body

    const data = await createFeedbackForClientService({
      featureId,
      feedback,
    })
    return data
  } catch (error) {
    throw error
  }
}
