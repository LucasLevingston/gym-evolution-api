import type { FastifyRequest, FastifyReply } from 'fastify'
import { getValidAccessToken } from '@/utils/fatsecret-auth'
import { z } from 'zod'

const popularFoodsQuerySchema = z.object({
  max_results: z.string().optional(),
  region: z.string().optional(),
  language: z.string().optional(),
})

export async function getPopularFoodsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const queryParams = request.query as Record<string, string>

    const { max_results, region, language } = popularFoodsQuerySchema.parse(queryParams)

    const accessToken = await getValidAccessToken()

    const url = new URL('https://platform.fatsecret.com/rest/server.api')

    url.searchParams.append('method', 'foods.popular')
    url.searchParams.append('format', 'json')
    if (max_results) url.searchParams.append('max_results', max_results)
    if (region) url.searchParams.append('region', region)
    if (language) url.searchParams.append('language', language)

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`FatSecret API error: ${response.status} ${errorText}`)
    }
    const data = await response.json()

    return reply.send(data)
  } catch (error) {
    throw error
  }
}
