import type { FastifyRequest } from 'fastify'
import { type CreatePurchaseInput, createPurchaseSchema } from '@/schemas/purchase-schema'
import { createNotificationService } from '@/services/notification'
import { createPurchaseService } from '@/services/purchase/create'

export async function createPurchaseController(
  request: FastifyRequest<{ Body: CreatePurchaseInput }>
) {
  try {
    const purchaseData = request.body

    const validationResult = createPurchaseSchema.safeParse(purchaseData)
    if (!validationResult.success) {
      throw new Error(`Invalid purchase data: ${validationResult.error.message}`)
    }

    const result = await createPurchaseService(purchaseData)

    if (result.status === 'WAITINGPAYMENT') {
      await createNotificationService({
        title: 'Pagamento pendente',
        message: `Você iniciou um pedido do plano ${result.purchase.Plan.name}. Complete o pagamento para ativar seu plano.`,
        type: 'info',
        userId: result.purchase.buyerId,
        link: `/purchases/${result.purchase.id}`,
      })
    } else if (result.status === 'COMPLETED') {
      await createNotificationService({
        title: 'Pedido confirmado',
        message: `Seu pagamento para o plano ${result.purchase.Plan.name} foi confirmado. Aproveite seu plano!`,
        type: 'success',
        userId: result.purchase.buyerId,
        link: `/purchases/${result.purchase.id}`,
      })

      await createNotificationService({
        title: 'Novo cliente',
        message: 'Você tem um novo cliente! Um aluno adquiriu seu plano.',
        type: 'success',
        userId: result.purchase.professionalId,
        link: '/professional-dashboard',
      })
    }

    return {
      purchase: result.purchase,
      paymentId: result.paymentId,
      paymentUrl: result.paymentUrl,
      status: result.status,
      preferenceId: result.preferenceId,
    }
  } catch (error) {
    throw error
  }
}
