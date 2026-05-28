import type { FastifyRequest, FastifyReply } from 'fastify'
import { getValidAccessToken } from '@/infrastructure/external/fatsecret/auth'
import { z } from 'zod'

const foodParamsSchema = z.object({
  id: z.string(),
})

export async function getFoodDetailsController(
  request: FastifyRequest<{
    Params: z.infer<typeof foodParamsSchema>
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params

    const accessToken = await getValidAccessToken()

    const url = new URL('https://platform.fatsecret.com/rest/server.api')

    url.searchParams.append('method', 'food.get')
    url.searchParams.append('food_id', id)
    url.searchParams.append('format', 'json')

    const flagOptions = request.query as Record<string, string>
    if (flagOptions.include_sub_categories) {
      url.searchParams.append(
        'include_sub_categories',
        flagOptions.include_sub_categories
      )
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
    request.log.error('Error getting food details:', error)
    return reply.code(500).send({ error: 'Failed to get food details' })
  }
}
