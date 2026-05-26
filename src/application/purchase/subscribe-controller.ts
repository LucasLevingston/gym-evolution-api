import { FastifyRequest, FastifyReply } from 'fastify'

interface CreateSubscriptionDTO {
  subscriptionPlanId: string
  billingInterval: string
}

interface UserPayload {
  id: string
}

export default class SubscriptionController {
  async getPlans(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(501).send({ error: 'Not implemented' })
  }

  async getPlan(
    _request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    return reply.code(501).send({ error: 'Not implemented' })
  }

  async getUserSubscription(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(501).send({ error: 'Not implemented' })
  }

  async createSubscription(
    _request: FastifyRequest<{ Body: CreateSubscriptionDTO }>,
    reply: FastifyReply
  ) {
    return reply.code(501).send({ error: 'Not implemented' })
  }

  async cancelSubscription(
    _request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    return reply.code(501).send({ error: 'Not implemented' })
  }

  async handleWebhook(
    _request: FastifyRequest<{ Body: { data: { id: string }; type: string } }>,
    reply: FastifyReply
  ) {
    return reply.code(501).send({ error: 'Not implemented' })
  }
}
