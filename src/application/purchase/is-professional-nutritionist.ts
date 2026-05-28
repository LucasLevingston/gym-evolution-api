import { prisma } from '@/infrastructure/database/prisma/client';

export async function isProfessionalNutritionistService(
  professionalId: string
): Promise<boolean> {
  const professional = await prisma.user.findUnique({
    where: { id: professionalId },
    select: { role: true },
  });

  return professional?.role === 'NUTRITIONIST';
}
