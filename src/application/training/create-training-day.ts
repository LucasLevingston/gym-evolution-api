import { DayOfWeekEnum } from '@prisma/client'
import { prisma } from '@/infrastructure/database/prisma/client'
import { createHistoryEntry } from '@/application/history/create-history-entry'

interface CreateTrainingDayParams {
  muscleGroups: string[]
  dayOfWeek: DayOfWeekEnum
  comments?: string
  trainingWeekId: string
  studentId: string
}

export async function createTrainingDay({
  muscleGroups,
  dayOfWeek,
  comments,
  trainingWeekId,
  studentId,
}: CreateTrainingDayParams) {
  const trainingDay = await prisma.trainingDay.create({
    data: {
      muscleGroups,
      dayOfWeek,
      comments,
      trainingWeekId,
    },
  })

  await createHistoryEntry(
    studentId,
    `Training day for ${muscleGroups.join(', ')} on ${dayOfWeek} created`
  )

  return trainingDay
}
