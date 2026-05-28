import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getProfessionalByIdService(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      ProfessionalSettings: true,
      reviews: true,
    },
  })

  if (!user || (user.role !== 'NUTRITIONIST' && user.role !== 'TRAINER')) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio,
    city: user.city,
    state: user.state,
    phone: user.phone,
    imageUrl: user.imageUrl,
    experience: user.experience,
    rating: user.rating,
    professionalSettings: user.ProfessionalSettings,
    specialties: user.specialties ? user.specialties.split(',') : [],
    certifications: user.certifications ? JSON.parse(user.certifications) : [],
    education: user.education ? JSON.parse(user.education) : [],
    availability: user.availability ? user.availability.split(',') : [],
    reviews: user.reviews ?? [],
  }
}
