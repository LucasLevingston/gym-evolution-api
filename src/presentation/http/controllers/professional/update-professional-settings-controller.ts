import { ProfessionalSettings } from '@prisma/client'
import { FastifyRequest } from 'fastify'
import { updateProfessionalSettingsService } from '@/application/professional/update-professional-settings-service'

export const updateProfessionalSettingsController = async (
  request: FastifyRequest<{ Body: { professionalSettings: ProfessionalSettings } }>
) => {
  try {
    const { professionalSettings } = request.body

    const result = updateProfessionalSettingsService(professionalSettings)

    return result
  } catch (error) {
    throw error
  }
}
