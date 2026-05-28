import { DayOfWeekEnum } from '@prisma/client';
import { prisma } from '@/infrastructure/database/prisma/client';
import { createHistoryEntry } from '@/application/history/create-history-entry';
import { ClientError } from '@/domain/shared/errors/client-error';

interface UpdateTrainingDayParams {
  muscleGroups?: string[];
  dayOfWeek?: DayOfWeekEnum;
  isCompleted?: boolean;
  comments?: string;
}

export async function updateTrainingDay(id: string, data: UpdateTrainingDayParams) {
  const trainingDay = await prisma.trainingDay.findUnique({
    where: { id },
    include: {
      trainingWeek: true,
    },
  });

  if (!trainingDay || !trainingDay.trainingWeek) {
    throw new ClientError('Training day not found');
  }

  const updatedTrainingDay = await prisma.trainingDay.update({
    where: { id },
    data,
  });

  await createHistoryEntry(
    trainingDay.trainingWeek.userId!,
    `Training day for ${trainingDay.muscleGroups.join(', ')} updated`
  );

  return updatedTrainingDay;
}
