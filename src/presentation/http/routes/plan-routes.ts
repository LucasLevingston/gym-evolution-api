import { createPlanController } from '@/presentation/http/controllers/plan/create'
import { deactivatePlanController } from '@/presentation/http/controllers/plan/deactivate'
import { getPlanByIdController } from '@/presentation/http/controllers/plan/get-by-id'
import { getPlansByProfessionalIdController } from '@/presentation/http/controllers/plan/get-plans-professional-id'
import { updatePlanController } from '@/presentation/http/controllers/plan/update'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { authenticate } from '@/presentation/http/middlewares/authenticate'

export async function planRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider()

  server.addHook('onRequest', authenticate)

  server.post('/', createPlanController)

  server.get('/:id', getPlanByIdController)

  server.get('/professional/:professionalId', getPlansByProfessionalIdController)

  server.patch('/:id', updatePlanController)

  server.delete('/:id', deactivatePlanController)
}
