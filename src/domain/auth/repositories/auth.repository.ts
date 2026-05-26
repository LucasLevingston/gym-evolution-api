import type { User } from '@prisma/client'

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  findByResetToken(token: string): Promise<User | null>
  create(data: Pick<User, 'name' | 'email' | 'password' | 'role'>): Promise<User>
  updateResetToken(id: string, token: string, expires: Date): Promise<User>
  updatePassword(id: string, passwordHash: string): Promise<User>
  linkGoogleAccount(userId: string, googleData: {
    accessToken: string
    refreshToken?: string
    expiresAt?: Date
    scope?: string
    tokenType?: string
  }): Promise<User>
}
