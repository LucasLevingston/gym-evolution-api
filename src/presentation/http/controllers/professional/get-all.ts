import * as professionalService from '@/application/professional';

export async function getProfessionalsController() {
  try {
    const professionals = await professionalService.getProfessionalsService();

    return professionals;
  } catch (error) {
    throw error;
  }
}
