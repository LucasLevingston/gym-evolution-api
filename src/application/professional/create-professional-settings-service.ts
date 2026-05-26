import { ProfessionalSettings } from '@prisma/client'
import { prisma } from '@/infrastructure/database/prisma/client'

export const createProfessionalSettingsService = async (
  professionalSettings: ProfessionalSettings
) => {
  return await prisma.professionalSettings.create({
    data: {
      ...professionalSettings,
    },
  })
}
