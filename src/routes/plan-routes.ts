import { createPlanController } from '@/controllers/plan/create'
import { deactivatePlanController } from '@/controllers/plan/deactivate'
import { getPlanByIdController } from '@/controllers/plan/get-by-id'
import { getPlansByProfessionalIdController } from '@/controllers/plan/get-plans-professional-id'
import { updatePlanController } from '@/controllers/plan/update'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { authenticate } from '@/middlewares/authenticate'

export async function planRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider()

  server.addHook('onRequest', authenticate)

  server.post('/', createPlanController)

  server.get('/:id', getPlanByIdController)

  server.get('/professional/:professionalId', getPlansByProfessionalIdController)

  server.patch('/:id', updatePlanController)

  server.delete('/:id', deactivatePlanController)
}
