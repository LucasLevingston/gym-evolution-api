import type { Plan } from '@prisma/client'

export interface IPlanRepository {
  findById(id: string): Promise<Plan | null>
  findByProfessionalId(professionalId: string): Promise<Plan[]>
  create(data: Partial<Plan>): Promise<Plan>
  update(id: string, data: Partial<Plan>): Promise<Plan>
  deactivate(id: string): Promise<Plan>
  isOwner(planId: string, professionalId: string): Promise<boolean>
}
