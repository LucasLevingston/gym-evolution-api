import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import path from 'path'
import fastifyCookie from '@fastify/cookie'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { fatsecretRoutes } from 'routes/fatsecret-routes'
import { googleRoutes } from 'routes/google-routes'
import { meetingRoutes } from 'routes/meeting-routes'
import { notificationRoutes } from 'routes/notification-routes'
import { planRoutes } from 'routes/plan-routes'
import { professionalRoutes } from 'routes/professional-routes'
import { purchaseRoutes } from 'routes/purchase-routes'
import { env } from './env'
import { authRoutes } from './routes/auth-routes'
import { dietRoutes } from './routes/diet-routes'
import { exerciseRoutes } from './routes/exercise-routes'
import { historyRoutes } from './routes/history-routes'
import { mealItemsRoutes } from './routes/meal-items-routes'
import { mealRoutes } from './routes/meal-routes'
import { serieRoutes } from './routes/serie-routes'
import { trainingDayRoutes } from './routes/training-day-routes'
import { trainingWeekRoutes } from './routes/training-week-routes'
import { userRoutes } from './routes/user-routes'
import { weightRoutes } from './routes/weight-routes'
import { errorHandler } from './utils/error-handler'

const { JWT_SECRET_KEY } = env

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.register(fastifyCors, {
  origin: '*',
})

server.register(fastifyJwt, {
  secret: JWT_SECRET_KEY || 'secret-key',
})

server.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Gym Evolution API',
      description: 'API for Gym Evolution',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
})

server.setErrorHandler(errorHandler)
server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)
server.register(fastifyCookie)
server.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

server.register(fastifyStatic, {
  root: path.join(process.cwd(), 'uploads'),
  prefix: '/uploads/',
})

server.register(userRoutes, { prefix: '/users' })
server.register(authRoutes, { prefix: '/auth' })
server.register(historyRoutes, { prefix: '/history' })
server.register(trainingWeekRoutes, { prefix: '/training-weeks' })
server.register(weightRoutes, { prefix: '/weights' })
server.register(trainingDayRoutes, { prefix: '/training-days' })
server.register(exerciseRoutes, { prefix: '/exercises' })
server.register(serieRoutes, { prefix: '/series' })
server.register(dietRoutes, { prefix: '/diets' })
server.register(mealRoutes, { prefix: '/meals' })
server.register(mealItemsRoutes, { prefix: '/meal-items' })
server.register(professionalRoutes, { prefix: '/professionals' })
server.register(planRoutes, { prefix: '/plans' })
server.register(notificationRoutes, { prefix: '/notifications' })
server.register(purchaseRoutes, { prefix: '/purchases' })
server.register(meetingRoutes, { prefix: '/meetings' })
server.register(googleRoutes, { prefix: '/google' })
server.register(fatsecretRoutes, { prefix: '/fatsecret' })

server.get('/help', () => {
  return {
    message: 'Welcome to GymEvolution!',
  }
})

export { server }
