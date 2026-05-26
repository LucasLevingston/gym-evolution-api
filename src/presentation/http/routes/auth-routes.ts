import { getAuthUrl } from '@/presentation/http/controllers/auth/auth'
import { googleCallbackController } from '@/presentation/http/controllers/auth/callback'
import { validateTokenController } from '@/presentation/http/controllers/auth/validate-token'
import type { FastifyInstance } from 'fastify'
import { errorResponseSchema } from '@/presentation/http/schemas/error-schema'
import { userResponseSchema, userSchema } from '@/presentation/http/schemas/userSchema'
import { z } from 'zod'
import { loginController } from '@/presentation/http/controllers/auth/login'
import { passwordRecover } from '@/presentation/http/controllers/auth/password-recover'
import { registerController } from '@/presentation/http/controllers/auth/register'
import { resetPasswordController } from '@/presentation/http/controllers/auth/reset-password'

export async function authRoutes(server: FastifyInstance) {
  const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const registerResponseSchema = z.object({
    user: userResponseSchema,
    token: z.string(),
  })

  server.post(
    '/register',
    {
      schema: {
        body: registerSchema,
        response: {
          201: registerResponseSchema,
          409: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['auth'],
        summary: 'Register a new user',
        description: 'Register a new user with name, email, password, and role',
      },
    },
    registerController
  )

  const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  })

  const loginResponseSchema = z.object({
    user: userSchema,
    token: z.string(),
  })

  server.post(
    '/login',
    {
      schema: {
        body: loginSchema,
        tags: ['auth'],
        summary: 'Login a user',
        description: 'Login a user with email and password',
      },
    },
    loginController
  )
  server.get(
    '/google',
    {
      schema: {
        tags: ['auth'],
        summary: 'Initiate Google OAuth flow',
        description: 'Redirects the user to Google for authentication',
      },
    },
    getAuthUrl
  )

  server.get(
    '/google/callback',
    {
      schema: {
        tags: ['auth'],
        summary: 'Handle Google OAuth callback',
        description: 'Processes the callback from Google OAuth',
      },
    },
    googleCallbackController
  )

  const forgotPasswordSchema = z.object({
    email: z.string().email(),
  })

  const forgotPasswordResponseSchema = z.object({
    message: z.string(),
    resetToken: z.string().optional(),
  })

  server.post(
    '/password-recover',
    {
      schema: {
        body: forgotPasswordSchema,
        response: {
          200: forgotPasswordResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['auth'],
        summary: 'Request password reset',
        description: 'Request a password reset link for a user',
      },
    },
    passwordRecover
  )

  const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(6),
  })

  const resetPasswordResponseSchema = z.object({
    message: z.string(),
  })

  server.post(
    '/reset-password',
    {
      schema: {
        body: resetPasswordSchema,
        response: {
          200: resetPasswordResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['auth'],
        summary: 'Reset password',
        description: 'Reset a user password with a valid token',
      },
    },
    resetPasswordController
  )

  server.post('/validate-token', validateTokenController)
}
