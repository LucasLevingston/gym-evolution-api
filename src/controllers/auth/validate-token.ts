import type { FastifyRequest } from 'fastify'
import { verifyToken } from '@/utils/jwt'

export async function validateTokenController(
  request: FastifyRequest<{ Body: { token: string } }>
) {
  try {
    const { token } = request.body

    const isValid = verifyToken(token)

    return isValid
  } catch (error) {
    throw error
  }
}
