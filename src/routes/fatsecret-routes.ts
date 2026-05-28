import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { authenticate } from '@/middlewares/authenticate'
import { getPopularFoodsController } from '@/controllers/fatscret/get-popular-foods'
import { searchFoodsController } from '@/controllers/fatscret/search-foods'
import { getFoodDetailsController } from '@/controllers/fatscret/get-food-details'
import { getRecentFoodsController } from '@/controllers/fatscret/get-recent-food'

export async function fatsecretRoutes(app: FastifyInstance): Promise<void> {
  const server = app.withTypeProvider<ZodTypeProvider>()
  server.addHook('onRequest', authenticate)

  server.get('/foods/search', searchFoodsController)
  server.get('/foods/:id', getFoodDetailsController)
  server.get('/foods/popular', getPopularFoodsController)
  server.get('/foods/recent', getRecentFoodsController)
}
