import { FastifyRequest } from 'fastify'
import { getProfessionalByIdService } from '@/services/professional'

export const getProfessionalByIdController = async (
  request: FastifyRequest<{ Params: { id: string } }>
) => {
  try {
    const professional = await getProfessionalByIdService(request.params.id)

    return professional
  } catch (error) {
    throw error
  }
}
