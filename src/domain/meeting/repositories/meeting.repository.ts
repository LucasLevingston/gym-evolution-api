import type { Meeting } from '@prisma/client'

export interface IMeetingRepository {
  findById(id: string): Promise<Meeting | null>
  findByUserId(userId: string, role: 'professional' | 'student'): Promise<Meeting[]>
  create(data: Partial<Meeting>): Promise<Meeting>
  update(id: string, data: Partial<Meeting>): Promise<Meeting>
  delete(id: string): Promise<void>
  getProfessionalAvailability(professionalId: string, date: Date): Promise<Date[]>
}
