import { oauth2Client, SCOPES } from '@/infrastructure/external/google/oauth2-client';
import { env } from '@/env';

export async function generateAuthUrl(userId: string): Promise<string> {
  const { BACKEND_URL } = env;

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state: userId,
    redirect_uri: `${BACKEND_URL}/google/callback`,
  });
}

export async function generateLoginAuthUrl(): Promise<string> {
  const { BACKEND_URL } = env;

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state: 'login',
    redirect_uri: `${BACKEND_URL}/google/callback`,
  });
}
