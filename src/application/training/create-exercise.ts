import { prisma } from '@/infrastructure/database/prisma/client'
import { createHistoryEntry } from '@/application/history/create-history-entry'

interface CreateExerciseParams {
  name: string
  group: string
  variation?: string
  repetitions: number
  sets: number
  trainingDayId: string
  studentId: string
}

export async function createExercise({
  name,
  group,
  variation,
  repetitions,
  sets,
  trainingDayId,
  studentId,
}: CreateExerciseParams) {
  // Create the exercise
  const exercise = await prisma.exercise.create({
    data: {
      name,
      group,
      variation,
      repetitions,
      sets,
      trainingDayId,
    },
  })

  // Create history entry
  await createHistoryEntry(studentId, `Exercise ${name} added to training day`)

  return exercise
}
