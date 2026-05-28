import { env } from '@/env'

export async function getFatSecretAccessToken(): Promise<string> {
  const API_KEY = env.FATSECRET_CLIENT_ID
  const API_SECRET = env.FATSECRET_CLIENT_SECRET

  if (!API_KEY || !API_SECRET) {
    throw new Error('FatSecret API credentials not configured')
  }

  try {
    const credentials = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')

    const response = await fetch('https://oauth.fatsecret.com/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'basic',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to get access token: ${response.status} ${errorText}`)
    }

    const data = await response.json()

    return data.access_token
  } catch (error) {
    console.error('Error getting FatSecret access token:', error)
    throw new Error('Failed to authenticate with FatSecret API')
  }
}

let tokenCache: {
  token: string
  expiresAt: number
} | null = null

export async function getValidAccessToken(): Promise<string> {
  const now = Date.now()
  if (tokenCache && tokenCache.expiresAt > now + 300000) {
    return tokenCache.token
  }

  const token = await getFatSecretAccessToken()

  tokenCache = {
    token,
    expiresAt: now + 23 * 60 * 60 * 1000,
  }

  return token
}
