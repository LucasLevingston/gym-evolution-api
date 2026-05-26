import { prisma } from '@/infrastructure/database/prisma/client'
import { ClientError } from '@/domain/shared/errors/client-error'

export async function deleteUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    throw new ClientError('User not found')
  }

  await prisma.user.delete({
    where: { id },
  })

  return true
}
