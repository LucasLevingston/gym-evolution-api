import { ProfessionalSettings } from '@prisma/client'
import { FastifyRequest } from 'fastify'
import { createProfessionalSettingsService } from '@/services/professional/create-professional-settings-service'

export const createProfessionalSettingsController = async (
  request: FastifyRequest<{ Body: { professionalSettings: ProfessionalSettings } }>
) => {
  try {
    const { professionalSettings } = request.body

    const result = createProfessionalSettingsService(professionalSettings)

    return result
  } catch (error) {
    throw error
  }
}
