import { getAllTrainers } from '@/application/user/get-all-trainers';

export async function getAllTrainersController() {
  try {
    const trainers = await getAllTrainers();

    return trainers;
  } catch (error) {
    throw error;
  }
}
