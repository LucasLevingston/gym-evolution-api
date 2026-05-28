import { ClientError } from '@/domain/shared/errors/client-error'
import { FastifyRequest } from 'fastify'
import { getWeightHistory } from '@/application/weight/get-weight-history'

export async function getWeightController(
  request: FastifyRequest<{
    Params: { id: string }
  }>
) {
  try {
    const { id } = request.params

    const weight = await getWeightHistory(id)
    if (!weight) {
      throw new ClientError('Weight entry not found')
    }
    return weight
  } catch (error) {
    throw error
  }
}
