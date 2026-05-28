import { prisma } from '@/infrastructure/database/prisma/client'
import { ClientError } from '@/domain/shared/errors/client-error'

export async function getSerieById(id: string) {
  const serie = await prisma.serie.findUnique({
    where: { id },
  })

  if (!serie) {
    throw new ClientError('Serie not found')
  }

  return serie
}
