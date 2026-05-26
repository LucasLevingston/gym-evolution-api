import { getUserByIdService } from '@/application/user/get-user-by-id'

export async function loginService(email: string) {
  return await getUserByIdService(email)
}
