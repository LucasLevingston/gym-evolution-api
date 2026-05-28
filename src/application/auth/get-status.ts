import { oauth2Client } from '@/infrastructure/external/google/oauth2-client';
import { prisma } from '@/infrastructure/database/prisma/client';

export async function getConnectionStatus(userId: string) {
  const googleAuth = await prisma.googleConnection.findUnique({
    where: { userId },
  });

  if (!googleAuth || !googleAuth.accessToken) {
    return {
      connected: false,
    };
  }

  const now = new Date();
  const isExpired = googleAuth.expiresAt! < now;

  if (isExpired && googleAuth.refreshToken) {
    try {
      oauth2Client.setCredentials({
        refresh_token: googleAuth.refreshToken,
      });

      const { credentials } = await oauth2Client.refreshAccessToken();

      const expiresAt = credentials.expiry_date
        ? new Date(credentials.expiry_date)
        : new Date(Date.now() + 3600 * 1000);

      await prisma.googleConnection.update({
        where: { userId },
        data: {
          accessToken: credentials.access_token!,
          expiresAt,
        },
      });

      return {
        connected: true,

        expiresAt: expiresAt.getTime(),
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      return { connected: false };
    }
  }

  return {
    connected: !isExpired,
  };
}
