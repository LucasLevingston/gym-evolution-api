import { prisma } from '@/infrastructure/database/prisma/client'

interface createFeedbackForClient {
  featureId: string
  feedback: string
}
export const createFeedbackForClientService = async ({
  featureId,
  feedback,
}: createFeedbackForClient) => {
  return await prisma.feature.update({
    where: { id: featureId },
    data: {
      feedback,
    },
  })
}
