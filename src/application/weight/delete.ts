import { prisma } from '@/infrastructure/database/prisma/client';

export const deleteWeightService = async (id: string) => {
  await prisma.weight.delete({ where: { id } });
};
