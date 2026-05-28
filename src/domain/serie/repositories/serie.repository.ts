import type { Serie } from '@prisma/client'

export interface ISerieRepository {
  findById(id: string): Promise<Serie | null>
  findAllByExerciseId(exerciseId: string): Promise<Serie[]>
  create(data: Partial<Serie>): Promise<Serie>
  update(id: string, data: Partial<Serie>): Promise<Serie>
  delete(id: string): Promise<void>
}
