import type { User } from '@prisma/client'

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByToken(token: string): Promise<User | null>
  findAll(): Promise<Partial<User>[]>
  findAllByRole(role: string): Promise<Partial<User>[]>
  create(data: Partial<User>): Promise<User>
  update(id: string, data: Partial<User>): Promise<User>
  delete(id: string): Promise<void>
  assignNutritionist(studentId: string, nutritionistId: string): Promise<User>
  assignTrainer(studentId: string, trainerId: string): Promise<User>
}
