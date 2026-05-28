import { ProfessionalSettings } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const createProfessionalSettingsService = async (
  professionalSettings: ProfessionalSettings
) => {
  return await prisma.professionalSettings.create({
    data: {
      ...professionalSettings,
    },
  })
}
