import { prisma } from '@/infrastructure/database/prisma/client';

export const getUserByToken = async (token: string) => {
  return await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { gt: new Date() },
    },
  });
};
