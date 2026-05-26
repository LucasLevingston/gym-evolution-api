import { createSubscriptionPlanController } from '@/presentation/http/controllers/subscription-plan/create'
import { deleteSubscriptionPlanController } from '@/presentation/http/controllers/subscription-plan/delete'
import { getAllSubscriptionPlansController } from '@/presentation/http/controllers/subscription-plan/get-all'
import { getSubscriptionPlanByIdController } from '@/presentation/http/controllers/subscription-plan/get-by-id'
import { updateSubscriptionPlanController } from '@/presentation/http/controllers/subscription-plan/update'
import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/presentation/http/middlewares/authenticate'

export async function subscriptionPlanRoutes(server: FastifyInstance) {
  server.get('/', getAllSubscriptionPlansController)
  server.get('/:id', getSubscriptionPlanByIdController)

  server.addHook('onRequest', authenticate)

  server.post('/', createSubscriptionPlanController)
  server.patch('/:id', updateSubscriptionPlanController)
  server.delete('/:id', deleteSubscriptionPlanController)
}
