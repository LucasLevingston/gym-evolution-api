import { prisma } from '@/lib/prisma'
import { mercadoPago } from '@/lib/mercadopago'

export async function retryPaymentService(
  purchaseId: string,
  paymentMethod: string,
  successUrl: string,
  cancelUrl: string
) {
  return await prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        Plan: true,
        professional: true,
        buyer: true,
      },
    })

    if (!purchase) {
      throw new Error('Purchase not found')
    }

    if (purchase.status !== 'WAITINGPAYMENT') {
      throw new Error('Only pending purchases can be retried')
    }

    const preferenceData = {
      items: [
        {
          id: purchase.planId,
          title: `Plano: ${purchase.Plan.name}`,
          description: purchase.Plan.description || 'Plano profissional',
          quantity: 1,
          unit_price: purchase.amount,
          currency_id: 'BRL',
        },
      ],
      back_urls: {
        success: successUrl,
        failure: cancelUrl,
        pending: cancelUrl,
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
      external_reference: purchaseId,
      metadata: {
        purchase_id: purchase.id,
        plan_id: purchase.planId,
        buyer_id: purchase.buyerId,
        professional_id: purchase.professionalId,
      },
    }
    // Create preference
    const preference = await mercadoPago.preference.create({
      body: preferenceData,
    })

    if (!preference || !preference.id) {
      throw new Error('Failed to create payment preference')
    }

    // Update purchase with new payment information
    await tx.purchase.update({
      where: { id: purchase.id },
      data: {
        paymentMethod,
      },
    })

    return {
      paymentUrl: preference.init_point,
      preferenceId: preference.id,
    }
  })
}
