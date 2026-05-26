import { prisma } from '@/infrastructure/database/prisma/client'
import { ClientError } from '@/domain/shared/errors/client-error'

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      sex: true,
      birthDate: true,
      phone: true,
      currentWeight: true,
      city: true,
      state: true,
    },
  })

  if (!user) {
    throw new ClientError('User not found')
  }

  return user
}
