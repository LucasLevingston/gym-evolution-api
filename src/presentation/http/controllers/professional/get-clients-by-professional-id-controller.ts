import { ClientError } from '@/domain/shared/errors/client-error'
import { FastifyRequest } from 'fastify'
import { getClientsByProfessionalIdService } from '@/application/professional/get-clients-by-professional-id'

export async function getClientsByProfessionalIdController(
  request: FastifyRequest<{ Params: { professionalId: string } }>
) {
  try {
    const { professionalId } = request.params

    if (!professionalId) {
      throw new ClientError('ID do profissional é obrigatório')
    }

    const clients = await getClientsByProfessionalIdService(professionalId)

    return clients
  } catch (error) {
    throw error
  }
}
