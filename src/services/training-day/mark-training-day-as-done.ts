import { prisma } from '../../lib/prisma';
import { createHistoryEntry } from '../history/create-history-entry';
import { ClientError } from '../../errors/client-error';

export async function markTrainingDayAsDone(id: string) {
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
    data: {
      isCompleted: true,
    },
  });

  const allTrainingDays = await prisma.trainingDay.findMany({
    where: {
      trainingWeekId: trainingDay.trainingWeekId,
    },
  });

  const allDaysDone = allTrainingDays.every((day) => day.isCompleted);

  if (allDaysDone) {
    await prisma.trainingWeek.update({
      where: { id: trainingDay.trainingWeekId! },
      data: {
        isCompleted: true,
      },
    });
  }

  await createHistoryEntry(
    trainingDay.trainingWeek.userId,
    `Training day for ${trainingDay.muscleGroups.join(', ')} marked as isCompleted`
  );

  return updatedTrainingDay;
}
