import { prisma } from '@/infrastructure/database/prisma/client';

export async function getUserByEmailService(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}
