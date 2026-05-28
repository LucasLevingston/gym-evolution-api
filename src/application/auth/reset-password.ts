import { prisma } from '@/infrastructure/database/prisma/client';

export async function resetPasswordService(id: string, newPassword: string) {
  return await prisma.user.update({
    where: { id },
    data: {
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });
}
