import { History, User } from '@prisma/client';
import { validateEvent } from '@/shared/utils/validate-event';
import { getUserHistory } from './get-user-history';
import { getUserByIdService } from '@/application/user/get-user-by-id';

export async function addToHistory(updatedUser: User): Promise<History[] | null> {
  try {
    const user = await getUserByIdService(updatedUser.id);

    if (!user) {
      throw new Error('User not found');
    }

    await validateEvent(user as unknown as Omit<User, 'password'>, updatedUser);

    return await getUserHistory(user.id ?? updatedUser.id);
  } catch (error) {
    throw new Error('Error adding to history');
  }
}
