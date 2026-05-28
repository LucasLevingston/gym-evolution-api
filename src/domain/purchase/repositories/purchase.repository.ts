import type { Purchase } from '@prisma/client'

export interface IPurchaseRepository {
  findById(id: string): Promise<Purchase | null>
  findByUserId(userId: string): Promise<Purchase[]>
  findByProfessionalId(professionalId: string): Promise<Purchase[]>
  create(data: Partial<Purchase>): Promise<Purchase>
  update(id: string, data: Partial<Purchase>): Promise<Purchase>
  cancel(id: string, reason?: string): Promise<Purchase>
  complete(id: string): Promise<Purchase>
  retry(id: string): Promise<Purchase>
}
