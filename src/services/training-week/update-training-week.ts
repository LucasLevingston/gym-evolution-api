import { DayOfWeekEnum } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { getTrainingWeekById } from './get-training-week-by-id'

interface SerieInput {
  repetitions?: number
  weight?: number
}

interface ExerciseInput {
  id?: string
  name?: string
  group?: string
  variation?: string
  repetitions?: number
  sets?: number
  isCompleted?: boolean
  seriesResults?: SerieInput[]
}

interface TrainingDayInput {
  id?: string
  dayOfWeek?: DayOfWeekEnum
  muscleGroups?: string[]
  isCompleted?: boolean
  comments?: string
  exercises?: ExerciseInput[]
}

interface UpdateTrainingWeekParams {
  weekNumber?: number
  information?: string
  done?: boolean
  startDate?: Date | string
  endDate?: Date | string
  isCompleted?: boolean
  userId?: string
  trainingDays?: TrainingDayInput[]
}

export async function updateTrainingWeek(id: string, data: UpdateTrainingWeekParams) {
  const existingTrainingWeek = await getTrainingWeekById(id)

  if (!existingTrainingWeek) {
    throw new Error(`Training week with id ${id} not found`)
  }

  const updateData: any = {
    weekNumber: data.weekNumber,
    information: data.information,
    isCompleted: data.isCompleted ?? data.done,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  }

  if (data.trainingDays !== undefined) {
    const updatedTrainingDayIds = data.trainingDays
      .filter((day) => day.id)
      .map((day) => day.id)

    const existingTrainingDayIds = existingTrainingWeek.trainingDays.map((day) => day.id)

    const trainingDaysToDelete = existingTrainingDayIds.filter(
      (id) => !updatedTrainingDayIds.includes(id)
    )

    if (trainingDaysToDelete.length > 0) {
      updateData.trainingDays = {
        ...(updateData.trainingDays || {}),
        deleteMany: {
          id: { in: trainingDaysToDelete },
        },
      }
    }

    const upsertOperations = data.trainingDays
      .filter((day) => day)
      .map((trainingDay) => {
        if (trainingDay.id) {
          const existingDay = existingTrainingWeek.trainingDays.find(
            (day) => day.id === trainingDay.id
          )

          let exercisesOperation: any = {}

          if (existingDay && trainingDay.exercises) {
            const updatedExerciseIds = trainingDay.exercises
              .filter((ex) => ex.id)
              .map((ex) => ex.id)

            const existingExerciseIds = (existingDay as any).exercises?.map((ex: any) => ex.id) ?? []

            const exercisesToDelete = existingExerciseIds.filter(
              (id: string) => !updatedExerciseIds.includes(id)
            )

            if (exercisesToDelete.length > 0) {
              exercisesOperation = {
                deleteMany: {
                  id: { in: exercisesToDelete },
                },
              }
            }

            if (trainingDay.exercises.length > 0) {
              exercisesOperation = {
                ...exercisesOperation,
                upsert: trainingDay.exercises
                  .filter((ex) => ex)
                  .map((exercise: ExerciseInput) => ({
                    where: { id: exercise.id || 'new-id-' + Math.random() },
                    create: {
                      name: exercise.name || '',
                      group: exercise.group || exercise.name || '',
                      variation: exercise.variation || '',
                      repetitions: exercise.repetitions || 0,
                      sets: exercise.sets || 0,
                      isCompleted: exercise.isCompleted || false,
                      seriesResults: exercise.seriesResults
                        ? { create: exercise.seriesResults }
                        : undefined,
                    },
                    update: {
                      name: exercise.name,
                      group: exercise.group || exercise.name || '',
                      variation: exercise.variation,
                      repetitions: exercise.repetitions,
                      sets: exercise.sets,
                      isCompleted: exercise.isCompleted,
                      seriesResults: exercise.seriesResults
                        ? {
                            deleteMany: {},
                            create: exercise.seriesResults,
                          }
                        : undefined,
                    },
                  })),
              }
            }
          }

          return {
            where: { id: trainingDay.id },
            update: {
              dayOfWeek: trainingDay.dayOfWeek,
              isCompleted: trainingDay.isCompleted,
              comments: trainingDay.comments,
              muscleGroups: trainingDay.muscleGroups || [],
              exercises: exercisesOperation,
            },
            create: {
              dayOfWeek: trainingDay.dayOfWeek,
              isCompleted: trainingDay.isCompleted,
              comments: trainingDay.comments,
              muscleGroups: trainingDay.muscleGroups || [],
              exercises:
                trainingDay.exercises && trainingDay.exercises.length > 0
                  ? {
                      create: trainingDay.exercises.map((exercise: ExerciseInput) => ({
                        name: exercise.name || '',
                        variation: exercise.variation || '',
                        repetitions: exercise.repetitions || 0,
                        sets: exercise.sets || 0,
                        isCompleted: exercise.isCompleted || false,
                        group: exercise.group || exercise.name || '',
                        seriesResults: exercise.seriesResults
                          ? { create: exercise.seriesResults }
                          : undefined,
                      })),
                    }
                  : undefined,
            },
          }
        }

        return {
          where: { id: 'new-id-' + Math.random() },
          create: {
            dayOfWeek: trainingDay.dayOfWeek || DayOfWeekEnum.MONDAY,
            isCompleted: trainingDay.isCompleted || false,
            comments: trainingDay.comments || '',
            muscleGroups: trainingDay.muscleGroups || [],
            exercises:
              trainingDay.exercises && trainingDay.exercises.length > 0
                ? {
                    create: trainingDay.exercises.map((exercise: ExerciseInput) => ({
                      name: exercise.name || '',
                      variation: exercise.variation || '',
                      repetitions: exercise.repetitions || 0,
                      sets: exercise.sets || 0,
                      isCompleted: exercise.isCompleted || false,
                      group: exercise.group || exercise.name || '',
                      seriesResults: exercise.seriesResults
                        ? { create: exercise.seriesResults }
                        : undefined,
                    })),
                  }
                : undefined,
          },
          update: {},
        }
      })

    if (upsertOperations && upsertOperations.length > 0) {
      updateData.trainingDays = {
        ...(updateData.trainingDays || {}),
        upsert: upsertOperations,
      }
    }
  }

  const updatedTrainingWeek = await prisma.trainingWeek.update({
    where: { id },
    data: updateData,
    include: {
      trainingDays: {
        include: {
          exercises: {
            include: {
              seriesResults: true,
            },
          },
        },
      },
    },
  })

  await createHistoryEntry(
    updatedTrainingWeek.userId,
    `Training week ${updatedTrainingWeek.weekNumber} updated`
  )

  return updatedTrainingWeek
}
