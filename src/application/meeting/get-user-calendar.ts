import { prisma } from '@/infrastructure/database/prisma/client';
import { google } from 'googleapis';
import { oauth2Client } from '@/infrastructure/external/google/oauth2-client';
import { ClientError } from '@/domain/shared/errors/client-error';

export async function getUserCalendarService(userId: string) {
  const googleConnection = await prisma.googleConnection.findUnique({
    where: { userId },
  });

  if (!googleConnection) {
    throw new ClientError('Google Calendar not connected');
  }

  oauth2Client.setCredentials({
    access_token: googleConnection.accessToken,
    refresh_token: googleConnection.refreshToken || undefined,
    expiry_date: googleConnection.expiresAt?.getTime() || undefined,
    token_type: googleConnection.tokenType,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const now = new Date();
  const defaultTimeMin = now;
  const defaultTimeMax = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: defaultTimeMin.toISOString(),
    timeMax: defaultTimeMax.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 100,
  });

  return response.data.items;
}
