import { ClientError } from '@/domain/shared/errors/client-error'
import { FastifyRequest } from 'fastify'
import { PurchaseParams } from '@/presentation/http/schemas/purchase-schema'
import { getPurchaseByIdService } from '@/application/purchase/get-by-id'

export async function getPurchaseByIdController(
  request: FastifyRequest<{ Params: PurchaseParams }>
) {
  try {
    const { id } = request.params
    const purchase = await getPurchaseByIdService(id)

    if (!purchase) {
      throw new ClientError('Purchase not found')
    }

    return purchase
  } catch (error) {
    throw error
  }
}
