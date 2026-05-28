import { prisma } from '@/infrastructure/database/prisma/client';
import { createHistoryEntry } from '@/application/history/create-history-entry';
import { ClientError } from '@/domain/shared/errors/client-error';

export async function deleteTrainingDay(id: string) {
  const trainingDay = await prisma.trainingDay.findUnique({
    where: { id },
    include: {
      trainingWeek: true,
    },
  });

  if (!trainingDay?.trainingWeek) {
    throw new ClientError('Training day not found');
  }

  await prisma.trainingDay.delete({
    where: { id },
  });

  await createHistoryEntry(
    trainingDay.trainingWeek.userId,
    `Training day for ${trainingDay.muscleGroups.join(', ')} deleted`
  );

  return true;
}
