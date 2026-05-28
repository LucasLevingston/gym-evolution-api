import { prisma } from '@/lib/prisma'

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
