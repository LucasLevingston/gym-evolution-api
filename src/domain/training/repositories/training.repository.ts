import type { Exercise, TrainingDay, TrainingWeek } from '@prisma/client'

export interface ITrainingWeekRepository {
  findById(id: string): Promise<TrainingWeek | null>
  findAllByUserId(userId: string): Promise<TrainingWeek[]>
  create(data: Partial<TrainingWeek>): Promise<TrainingWeek>
  update(id: string, data: Partial<TrainingWeek>): Promise<TrainingWeek>
  delete(id: string): Promise<void>
}

export interface ITrainingDayRepository {
  findById(id: string): Promise<TrainingDay | null>
  findAllByWeekId(trainingWeekId: string): Promise<TrainingDay[]>
  create(data: Partial<TrainingDay>): Promise<TrainingDay>
  update(id: string, data: Partial<TrainingDay>): Promise<TrainingDay>
  delete(id: string): Promise<void>
  markAsDone(id: string): Promise<TrainingDay>
}

export interface IExerciseRepository {
  findById(id: string): Promise<Exercise | null>
  findAllByDayId(trainingDayId: string): Promise<Exercise[]>
  create(data: Partial<Exercise>): Promise<Exercise>
  update(id: string, data: Partial<Exercise>): Promise<Exercise>
  delete(id: string): Promise<void>
  markAsDone(id: string): Promise<Exercise>
}
