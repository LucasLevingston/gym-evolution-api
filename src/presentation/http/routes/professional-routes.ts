import {
  getNutritionistsController,
  getTrainersController,
} from '@/presentation/http/controllers/professional'
import { getProfessionalsController } from '@/presentation/http/controllers/professional/get-all'
import { getProfessionalByIdController } from '@/presentation/http/controllers/professional/get-by-id'
import { approveProfessionalController } from '@/presentation/http/controllers/professional/approve-professional'
import { createDietForClientController } from '@/presentation/http/controllers/professional/create-diet-for-client-controller'
import { createFeedbackForClientController } from '@/presentation/http/controllers/professional/create-feedback-for-client-controller'
import { createProfessionalSettingsController } from '@/presentation/http/controllers/professional/create-professional-settings-controller'
import { createTrainingForClientController } from '@/presentation/http/controllers/professional/create-training-for-client-controller'
import { getClientsByProfessionalIdController } from '@/presentation/http/controllers/professional/get-clients-by-professional-id-controller'
import { getMetricsByProfessionalIdController } from '@/presentation/http/controllers/professional/get-metrics-by-professional-id-controller'
import { getTasksByProfessionalIdController } from '@/presentation/http/controllers/professional/get-tasks-by-professional-id-controller'
import { rejectProfessionalController } from '@/presentation/http/controllers/professional/reject-professional'
import { updateProfessionalSettingsController } from '@/presentation/http/controllers/professional/update-professional-settings-controller'
import type { FastifyInstance } from 'fastify'
import { registerProfessionalController } from '@/presentation/http/controllers/professional/register-professional'
import { authenticate } from '@/presentation/http/middlewares/authenticate'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyHandler = any

export async function professionalRoutes(app: FastifyInstance) {
  app.get('/:id', getProfessionalByIdController as AnyHandler)
  app.get('/nutritionists', getNutritionistsController as AnyHandler)
  app.get('/trainers', getTrainersController as AnyHandler)
  app.get('/all', getProfessionalsController as AnyHandler)

  app.post('/register', { onRequest: [authenticate] }, registerProfessionalController as AnyHandler)
  app.get('/reject/:id', { onRequest: [authenticate] }, rejectProfessionalController as AnyHandler)
  app.get('/approve/:id', { onRequest: [authenticate] }, approveProfessionalController as AnyHandler)

  app.get(
    '/get-clients/:professionalId',
    { onRequest: [authenticate] },
    getClientsByProfessionalIdController as AnyHandler
  )
  app.get(
    '/:professionalId/tasks',
    { onRequest: [authenticate] },
    getTasksByProfessionalIdController as AnyHandler
  )
  app.get(
    '/:professionalId/metrics',
    { onRequest: [authenticate] },
    getMetricsByProfessionalIdController as AnyHandler
  )
  app.put(
    '/:professionalId',
    { onRequest: [authenticate] },
    updateProfessionalSettingsController as AnyHandler
  )
  app.post('/', { onRequest: [authenticate] }, createProfessionalSettingsController as AnyHandler)

  app.post(
    '/client/training',
    { onRequest: [authenticate] },
    createTrainingForClientController as AnyHandler
  )

  app.post(
    '/client/diet',
    { onRequest: [authenticate] },
    createDietForClientController as AnyHandler
  )
  app.post(
    '/client/feedback',
    { onRequest: [authenticate] },
    createFeedbackForClientController as AnyHandler
  )
}
