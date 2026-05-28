import { DayOfWeekEnum } from '@prisma/client'
import { prisma } from '@/infrastructure/database/prisma/client'
import { createHistoryEntry } from '@/application/history/create-history-entry'

interface Exercise {
  name: string
  variation?: string
  repetitions: number
  sets: number
  isCompleted?: boolean
  group: string
}

interface TrainingDay {
  muscleGroups: string[]
  dayOfWeek: DayOfWeekEnum
  day?: string | Date
  comments?: string
  isCompleted?: boolean
  exercises?: Exercise[]
}

interface CreateTrainingWeekParams {
  weekNumber: number
  information?: string
  userId: string
  startDate: Date
  endDate: Date
  trainingDays: TrainingDay[]
}

export async function createTrainingWeek({
  weekNumber,
  information,
  userId,
  startDate,
  endDate,
  trainingDays,
}: CreateTrainingWeekParams) {
  const trainingWeek = await prisma.trainingWeek.create({
    data: {
      weekNumber,
      information,
      userId,
      startDate,
      endDate,
      trainingDays: {
        create: trainingDays.map((trainingDay) => {
          const { day, ...trainingDayWithoutDay } = trainingDay

          return {
            ...trainingDayWithoutDay,
            exercises: {
              create: trainingDay.exercises?.map((exercise) => ({
                name: exercise.name,
                repetitions: exercise.repetitions,
                sets: exercise.sets,
                variation: exercise.variation,
                group: exercise.group,
              })),
            },
          }
        }),
      },
    },
    include: {
      trainingDays: {
        include: {
          exercises: true,
        },
      },
    },
  })

  await createHistoryEntry(userId, `Training week ${weekNumber} created`)

  return trainingWeek
}
