import { FastifyRequest } from 'fastify'
import { ClientError } from '@/domain/shared/errors/client-error'
import { comparePassword, generateToken } from '@/shared/utils/jwt'
import { getUserByEmailService } from '@/application/user/get-by-email'

export async function loginController(
  request: FastifyRequest<{ Body: { email: string; password: string } }>
) {
  try {
    const { email, password } = request.body

    const user = await getUserByEmailService(email)

    if (!user) {
      throw new ClientError('User not found')
    }

    const isPasswordCorrect = await comparePassword(password, user.password)
    if (!isPasswordCorrect) {
      throw new ClientError('Invalid password')
    }

    const token = generateToken(user.id)

    return {
      user,
      token,
    }
  } catch (error) {
    throw error
  }
}
