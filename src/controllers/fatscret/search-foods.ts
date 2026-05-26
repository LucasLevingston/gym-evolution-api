import type { FastifyRequest, FastifyReply } from 'fastify'
import { getValidAccessToken } from '@/utils/fatsecret-auth'
import { z } from 'zod'

const searchQuerySchema = z.object({
  query: z.string().min(1),
  page: z.number().optional().default(0),
  maxResults: z.number().optional().default(10),
  brandedFoodOnly: z.boolean().optional().default(false),
})

export async function searchFoodsController(
  request: FastifyRequest<{
    Querystring: z.infer<typeof searchQuerySchema>
  }>,
  reply: FastifyReply
) {
  try {
    const { query, page, maxResults, brandedFoodOnly } = request.query

    // Get a valid access token
    const accessToken = await getValidAccessToken()

    // Build the URL with query parameters
    const url = new URL('https://platform.fatsecret.com/rest/foods/search/v1')
    url.searchParams.append('method', 'foods.search')
    url.searchParams.append('search_expression', query)
    url.searchParams.append('page_number', page.toString())
    url.searchParams.append('max_results', maxResults.toString())
    url.searchParams.append('format', 'json')

    if (brandedFoodOnly) {
      url.searchParams.append('generic_description', 'portion')
    }

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
    console.error('Error searching foods:', error)
    request.log.error('Error searching foods:', error)
    return reply.code(500).send({ error: 'Failed to search foods' })
  }
}
