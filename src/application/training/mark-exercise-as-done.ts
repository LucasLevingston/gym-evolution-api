import { prisma } from '@/infrastructure/database/prisma/client';
import { createHistoryEntry } from '@/application/history/create-history-entry';
import { ClientError } from '@/domain/shared/errors/client-error';

export async function markExerciseAsDone(id: string) {
  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      trainingDay: {
        include: {
          trainingWeek: true,
        },
      },
    },
  });

  if (
    !exercise ||
    !exercise.trainingDayId ||
    !exercise.trainingDay?.trainingWeekId ||
    !exercise.trainingDay?.trainingWeek?.userId
  ) {
    throw new ClientError('Exercise not found');
  }

  // Mark the exercise as isCompleted
  const updatedExercise = await prisma.exercise.update({
    where: { id },
    data: {
      isCompleted: true,
    },
  });

  // Check if all exercises in the training day are isCompleted
  const allExercises = await prisma.exercise.findMany({
    where: {
      trainingDayId: exercise.trainingDayId,
    },
  });

  const allDone = allExercises.every((ex) => ex.isCompleted);

  if (allDone) {
    // Mark the training day as isCompleted
    await prisma.trainingDay.update({
      where: { id: exercise.trainingDayId },
      data: {
        isCompleted: true,
      },
    });

    // Check if all training days in the week are isCompleted
    const allTrainingDays = await prisma.trainingDay.findMany({
      where: {
        trainingWeekId: exercise.trainingDay.trainingWeekId,
      },
    });

    const allDaysDone = allTrainingDays.every((day) => day.isCompleted);

    if (allDaysDone) {
      // Mark the training week as isCompleted
      await prisma.trainingWeek.update({
        where: { id: exercise.trainingDay.trainingWeekId },
        data: {
          isCompleted: true,
        },
      });
    }
  }

  // Create history entry
  await createHistoryEntry(
    exercise.trainingDay.trainingWeek.userId,
    `Exercise ${exercise.name} marked as isCompleted`
  );

  return updatedExercise;
}
