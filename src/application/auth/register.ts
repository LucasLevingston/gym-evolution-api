import { User } from '@prisma/client';
import { prisma } from '@/infrastructure/database/prisma/client';

export async function registerUserService(data: {
  email: string;
  password: string;
}): Promise<User> {
  return await prisma.user.create({
    data,
  });
}
