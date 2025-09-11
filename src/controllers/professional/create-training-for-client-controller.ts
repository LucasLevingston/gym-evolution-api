import type { FastifyRequest } from 'fastify'
import { createTrainingForClientService } from '@/services/professional/create-training-for-client-service'
import { User } from '@prisma/client'
import { ClientError } from 'errors/client-error'

export async function createTrainingForClientController(
  request: FastifyRequest<{ Body: { trainingWeek: any } }>
) {
  try {
    const { id: professionalId } = request.user as User
    const { trainingWeek } = request.body
    console.log(trainingWeek)

    if (!trainingWeek) {
      throw new ClientError('Error on request body')
    }

    const {
      purchaseId,
      clientId,
      featureId,
      weekNumber,
      startDate,
      endDate,
      information,
      trainingDays,
    } = trainingWeek
    const data = await createTrainingForClientService({
      clientId,
      professionalId,
      purchaseId,
      featureId,
      weekNumber,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      information,
      trainingDays,
    })
    return data
  } catch (error) {
    throw error
  }
}
