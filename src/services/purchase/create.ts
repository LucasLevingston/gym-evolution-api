import type { CreatePurchaseInput } from '../../schemas/purchase-schema'
import { createPaymentService } from '../../services/mercadopago/create'
import { prisma } from 'lib/prisma'

export async function createPurchaseService(params: CreatePurchaseInput) {
  const { planId, successUrl, cancelUrl, amount, buyerId } = params

  try {
    return await prisma.$transaction(async (tx) => {
      const plan = await tx.plan.findUnique({
        where: { id: planId },
        include: { professional: true },
      })

      if (!plan) {
        throw new Error('Plan not found')
      }

      if (!plan.isActive) {
        throw new Error('Plan is not active')
      }

      const buyer = await tx.user.findUnique({
        where: { id: buyerId },
        select: { name: true, email: true },
      })

      if (!buyer) {
        throw new Error('Buyer not found')
      }

      const purchase = await tx.purchase.create({
        data: {
          planId,
          amount,
          status: 'WAITINGPAYMENT',
          professionalId: plan.professionalId,
          buyerId,
        },
        include: {
          Plan: {
            select: {
              name: true,
            },
          },
        },
      })

      const paymentResult = await createPaymentService({
        purchaseId: purchase.id,
        amount,
        successUrl,
        cancelUrl,
        description: `Pagamento: ${plan.name} - ${buyer.name || buyer.email}`,
        customerName: buyer.name || buyerId,
        professionalId: plan.professionalId,
        buyerId,
        planId,
      })

      const updatedPurchase = await tx.purchase.update({
        where: { id: purchase.id },
        data: {
          paymentId: paymentResult.paymentId,
          paymentMethod: paymentResult.paymentMethod,
          status: paymentResult.status === 'COMPLETED' ? 'COMPLETED' : 'WAITINGPAYMENT',
        },
        include: {
          Plan: {
            select: {
              name: true,
            },
          },
        },
      })

      return {
        purchase: updatedPurchase,
        paymentId: paymentResult.paymentId,
        paymentUrl: paymentResult.paymentUrl,
        status: updatedPurchase.status,
        preferenceId: paymentResult.preferenceId,
      }
    })
  } catch (error) {
    console.error('Error in createPurchaseService:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}
