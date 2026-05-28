import type { User } from '@prisma/client'
import type { Client, Task } from '@/shared/types/client-type'

export interface IProfessionalRepository {
  findById(id: string): Promise<User | null>
  findAll(): Promise<Partial<User>[]>
  findAllNutritionists(): Promise<Partial<User>[]>
  findAllTrainers(): Promise<Partial<User>[]>
  register(data: Partial<User>): Promise<User>
  approve(id: string): Promise<User>
  reject(id: string): Promise<User>
  getClientsByProfessionalId(professionalId: string): Promise<Client[]>
  getTasksByProfessionalId(professionalId: string): Promise<Task[]>
  getMetricsByProfessionalId(professionalId: string): Promise<Record<string, unknown>>
  createSettings(professionalId: string, data: Record<string, unknown>): Promise<unknown>
  updateSettings(professionalId: string, data: Record<string, unknown>): Promise<unknown>
}
