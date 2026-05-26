import { prisma } from '@/infrastructure/database/prisma/client'
import type { Credentials } from 'google-auth-library'
import { ClientError } from '@/domain/shared/errors/client-error'
import { google } from 'googleapis'
import { oauth2Client } from '@/infrastructure/external/google/oauth2-client'
import { generateToken, hashPassword } from '@/shared/utils/jwt'
import { randomUUID } from 'crypto'
import { getUserByIdService } from '@/application/user/get-user-by-id'
import { createHistoryEntry } from '@/application/history/create-history-entry'
import { getUserByEmailService } from '@/application/user/get-by-email'

interface CallbackGoogleServiceParams {
  state: string
  tokens: Credentials
}

export async function callbackGoogleService({
  state,
  tokens,
}: CallbackGoogleServiceParams) {
  if (!tokens.access_token) {
    throw new ClientError('Invalid tokens received from Google')
  }

  oauth2Client.setCredentials(tokens)

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  })

  const { data } = await oauth2.userinfo.get()

  if (!data.email) {
    throw new ClientError('Email not provided by Google')
  }

  if (state === 'login') {
    let user = await getUserByEmailService(data.email)

    if (!user) {
      const hashedPassword = await hashPassword(randomUUID())

      user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name || data.email.split('@')[0],
          role: 'STUDENT',
          imageUrl: data.picture,
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token,
          GoogleConnection: {
            create: {
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token || null,
              expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
              scope: tokens.scope || null,
              tokenType: tokens.token_type || 'Bearer',
            },
          },
        },
      })
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token,
          GoogleConnection: {
            upsert: {
              create: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token || null,
                expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
                scope: tokens.scope || null,
                tokenType: tokens.token_type || 'Bearer',
              },
              update: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token || null,
                expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
                scope: tokens.scope || null,
                tokenType: tokens.token_type || 'Bearer',
              },
            },
          },
        },
      })
    }

    const token = generateToken(user.id)

    createHistoryEntry(user.id, 'Logged in with Google')

    return {
      user,
      token,
      isNewUser: user.createdAt.getTime() === user.updatedAt.getTime(),
    }
  }
  const userId = state

  const user = await getUserByIdService(userId)

  if (!user) {
    throw new ClientError('User not found')
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      googleAccessToken: tokens.access_token,
      googleRefreshToken: tokens.refresh_token,
    },
  })

  const googleConnection = await prisma.googleConnection.upsert({
    where: {
      userId,
    },
    update: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || null,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      scope: tokens.scope || null,
      tokenType: tokens.token_type || 'Bearer',
      updatedAt: new Date(),
    },
    create: {
      userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || null,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      scope: tokens.scope || null,
      tokenType: tokens.token_type || 'Bearer',
    },
  })

  createHistoryEntry(userId, 'Connected Google account')

  return { googleConnection }
}
