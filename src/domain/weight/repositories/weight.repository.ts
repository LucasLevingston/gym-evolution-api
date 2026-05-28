import type { Weight } from '@prisma/client'

export interface IWeightRepository {
  findById(id: string): Promise<Weight | null>
  findAllByUserId(userId: string): Promise<Weight[]>
  create(data: Partial<Weight>): Promise<Weight>
  update(id: string, data: Partial<Weight>): Promise<Weight>
  delete(id: string): Promise<void>
  addRecord(userId: string, weight: string, bf?: string): Promise<Weight>
}
