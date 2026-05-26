import { Serie } from '@prisma/client';
import { prisma } from '@/infrastructure/database/prisma/client';
import { createHistoryEntry } from '@/application/history/create-history-entry';

interface CreateSerieParams {
  seriesIndex: number;
  repetitions: number;
  weight: number;
  exerciseId: string;
  studentId: string;
}

export async function createSerie({
  seriesIndex,
  repetitions,
  weight,
  exerciseId,
  studentId,
}: CreateSerieParams) {
  // Check if a series with this index already exists
  const existingSerie = await prisma.serie.findFirst({
    where: {
      exerciseId,
      seriesIndex,
    },
  });

  let serie: Serie;

  if (existingSerie) {
    // Update existing serie
    serie = await prisma.serie.update({
      where: { id: existingSerie.id },
      data: {
        repetitions,
        weight,
      },
    });
  } else {
    // Create new serie
    serie = await prisma.serie.create({
      data: {
        seriesIndex,
        repetitions,
        weight,
        exerciseId,
      },
    });
  }

  // Get the exercise name for the history entry
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
  });

  // Create history entry
  await createHistoryEntry(
    studentId,
    `Series ${seriesIndex + 1} recorded for exercise ${exercise?.name}`
  );

  return serie;
}
