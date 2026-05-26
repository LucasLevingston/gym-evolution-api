import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getNutritionistsService() {
  const nutritionists = await prisma.user.findMany({
    where: { role: 'NUTRITIONIST' },
    include: { reviews: true },
  });

  return nutritionists.map((nutritionist) => ({
    id: nutritionist.id,
    name: nutritionist.name,
    email: nutritionist.email,
    role: nutritionist.role,
    city: nutritionist.city,
    state: nutritionist.state,
    imageUrl: nutritionist.imageUrl,
    experience: nutritionist.experience,
    rating: nutritionist.rating,
    specialties: nutritionist.specialties ? JSON.parse(nutritionist.specialties) : [],
    certifications: nutritionist.certifications
      ? JSON.parse(nutritionist.certifications)
      : [],
    education: nutritionist.education ? JSON.parse(nutritionist.education) : [],
    availability: nutritionist.availability ? JSON.parse(nutritionist.availability) : [],
    reviews: nutritionist.reviews,
  }));
}
