import { createSubscriptionPlanController } from 'controllers/subscription-plan/create'
import { deleteSubscriptionPlanController } from 'controllers/subscription-plan/delete'
import { getAllSubscriptionPlansController } from 'controllers/subscription-plan/get-all'
import { getSubscriptionPlanByIdController } from 'controllers/subscription-plan/get-by-id'
import { updateSubscriptionPlanController } from 'controllers/subscription-plan/update'
import type { FastifyInstance } from 'fastify'
import { authenticate } from 'middlewares/authenticate'

export async function subscriptionPlanRoutes(server: FastifyInstance) {
  server.get('/', getAllSubscriptionPlansController)
  server.get('/:id', getSubscriptionPlanByIdController)

  server.addHook('onRequest', authenticate)

  server.post('/', createSubscriptionPlanController)
  server.patch('/:id', updateSubscriptionPlanController)
  server.delete('/:id', deleteSubscriptionPlanController)
}
