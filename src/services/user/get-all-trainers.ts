import { prisma } from '@/lib/prisma';

export async function getAllTrainers() {
  const nutritionists = await prisma.user.findMany({
    where: {
      role: 'TRAINER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      availability: true,
      certifications: true,
      specialties: true,
      education: true,
      reviews: true,
      imageUrl: true,
      rating: true,
      experience: true,
    },
  });

  return nutritionists.map((nutritionist) => ({
    ...nutritionist,
    availability: nutritionist.availability ? JSON.parse(nutritionist.availability) : [],
    certifications: nutritionist.certifications
      ? JSON.parse(nutritionist.certifications)
      : [],
    specialties: nutritionist.specialties ? JSON.parse(nutritionist.specialties) : [],
    education: nutritionist.education ? JSON.parse(nutritionist.education) : [],
  }));
}
