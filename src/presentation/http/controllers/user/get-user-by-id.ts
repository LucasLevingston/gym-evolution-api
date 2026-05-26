import type { FastifyRequest } from 'fastify'
import { getUserByIdService } from '@/application/user/get-user-by-id'
import { ClientError } from '@/domain/shared/errors/client-error'
import { User } from '@prisma/client'

interface Params {
  id: string
}

export async function getUserByIdController(
  request: FastifyRequest<{
    Params: Params
  }>
) {
  try {
    const { id } = request.params

    const { id: userId, role } = request.user as User

    if (id !== userId && role === 'STUDENT') {
      throw new ClientError('Forbidden')
    }

    const userData = await getUserByIdService(id)

    if (!userData) {
      throw new ClientError('User not found')
    }

    return userData
  } catch (error) {
    throw error
  }
}
