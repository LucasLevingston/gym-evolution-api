import { prisma } from '@/infrastructure/database/prisma/client'

export async function getProfessionalsService() {
  const professionals = await prisma.user.findMany({
    where: {
      OR: [{ role: 'NUTRITIONIST' }, { role: 'TRAINER' }],
    },
    include: {
      reviews: true,
      ProfessionalSettings: true,
    },
  })

  return professionals.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    city: user.city,
    state: user.state,
    imageUrl: user.imageUrl,
    experience: user.experience,
    rating: user.rating,
    approvalStatus: user.approvalStatus,
    specialties: user.specialties ? user.specialties.split(',') : [],
    certifications: user.certifications ? JSON.parse(user.certifications) : [],
    education: user.education ? JSON.parse(user.education) : [],
    availability: user.availability ? user.availability.split(',') : [],
    reviews: user.reviews,
    createdAt: user.createdAt,
    documentUrl: user.documentUrl,
    ProfessionalSettings: user.ProfessionalSettings,
  }))
}
