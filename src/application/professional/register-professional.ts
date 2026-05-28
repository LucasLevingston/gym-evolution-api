import { ProfessionalSettings } from '@prisma/client'
import { prisma } from '@/infrastructure/database/prisma/client'
import { getUserByIdService } from '@/application/user/get-user-by-id'

interface RegisterProfessionalParams {
  userId: string
  role: 'TRAINER' | 'NUTRITIONIST'
  bio: string
  experience: number
  specialties: string[]
  certifications: string
  education: string
  availability: string
  imageUrl: string | null
  documentUrl: string | null
  professionalSettings: ProfessionalSettings
}
export async function registerProfessionalService(params: RegisterProfessionalParams) {
  const {
    userId,
    role,
    bio,
    experience,
    specialties,
    certifications,
    education,
    availability,
    imageUrl,
    documentUrl,
    professionalSettings,
  } = params

  const user = await getUserByIdService(userId)

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      role,
      bio,
      experience,
      specialties: specialties.join(','),
      certifications:
        Array.isArray(certifications) || typeof certifications === 'object'
          ? JSON.stringify(certifications)
          : certifications,

      education:
        Array.isArray(education) || typeof education === 'object'
          ? JSON.stringify(education)
          : education,
      availability,
      imageUrl,
      documentUrl,
      approvalStatus: 'WAITING',
      ProfessionalSettings: user?.ProfessionalSettings
        ? {
            update: professionalSettings,
          }
        : {
            create: professionalSettings,
          },
    },
  })

  return updatedUser
}
