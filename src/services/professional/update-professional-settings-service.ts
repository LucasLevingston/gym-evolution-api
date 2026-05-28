import { ProfessionalSettings } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const updateProfessionalSettingsService = async (
  professionalSettings: ProfessionalSettings
) => {
  return await prisma.professionalSettings.update({
    where: {
      userId: professionalSettings.userId,
    },
    data: {
      ...professionalSettings,
    },
  })
}
