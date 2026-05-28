import { prisma } from '@/infrastructure/database/prisma/client'
import { DayOfWeekEnum } from '@prisma/client'

interface CreateTrainingForClientInput {
  weekNumber: number
  startDate: Date
  endDate: Date
  information?: string
  clientId: string
  professionalId: string
  purchaseId: string
  featureId: string
  trainingDays: TrainingDayInput[]
}
interface TrainingDayInput {
  muscleGroups: string[]
  dayOfWeek: DayOfWeekEnum
  comments?: string
  exercises: ExerciseInput[]
}

interface ExerciseInput {
  name: string
  variation?: string
  repetitions: number
  sets: number
  seriesResults?: SerieInput[]
  group: string
}

interface SerieInput {
  seriesIndex?: number
  repetitions?: number
  weight?: number
}

export async function createTrainingForClientService(data: CreateTrainingForClientInput) {
  try {
    const feature = await prisma.feature.findFirst({
      where: {
        id: data.featureId,
        plan: {
          purchases: {
            some: {
              id: data.purchaseId,
              professionalId: data.professionalId,
              buyerId: data.clientId,
            },
          },
        },
        type: 'TRAINING_WEEK',
      },
    })

    if (!feature) {
      throw new Error('Feature não encontrada ou não pertence à compra especificada')
    }

    if (feature.trainingWeekId) {
      throw new Error('Já existe um treino criado para esta feature')
    }

    const trainingWeek = await prisma.$transaction(async (tx) => {
      const createdTrainingWeek = await tx.trainingWeek.create({
        data: {
          weekNumber: data.weekNumber,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          information: data.information,
          isCompleted: false,
          userId: data.clientId,
        },
      })

      // Criar os TrainingDays com seus exercícios
      for (const day of data.trainingDays) {
        const createdDay = await tx.trainingDay.create({
          data: {
            muscleGroups: day.muscleGroups,
            dayOfWeek: day.dayOfWeek,
            comments: day.comments,
            isCompleted: false,
            trainingWeekId: createdTrainingWeek.id,
          },
        })

        // Criar os exercícios para cada dia
        for (const exercise of day.exercises) {
          const createdExercise = await tx.exercise.create({
            data: {
              name: exercise.name,
              variation: exercise.variation,
              repetitions: exercise.repetitions,
              sets: exercise.sets,
              isCompleted: false,
              trainingDayId: createdDay.id,
              group: exercise.group,
            },
          })

          // Criar as séries para cada exercício, se fornecidas
          if (exercise.seriesResults && exercise.seriesResults.length > 0) {
            for (const serie of exercise.seriesResults) {
              await tx.serie.create({
                data: {
                  seriesIndex: serie.seriesIndex,
                  repetitions: serie.repetitions,
                  weight: serie.weight,
                  exerciseId: createdExercise.id,
                },
              })
            }
          }
        }
      }

      // Atualizar a feature com o ID do treino criado
      await tx.feature.update({
        where: { id: data.featureId },
        data: {
          trainingWeekId: createdTrainingWeek.id,
        },
      })

      // Criar uma notificação para o cliente
      await tx.notification.create({
        data: {
          title: 'Novo Treino Disponível',
          message: `Seu profissional criou um novo treino para você: Semana ${data.weekNumber}`,
          type: 'TRAINING',
          read: false,
          link: `/training/${createdTrainingWeek.id}`,
          userId: data.clientId,
        },
      })

      return createdTrainingWeek
    })

    return trainingWeek
  } catch (error) {
    throw error
  }
}
