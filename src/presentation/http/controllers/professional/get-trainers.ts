import type { FastifyRequest } from 'fastify';
import * as professionalService from '@/application/professional';

export async function getTrainersController(request: FastifyRequest) {
  try {
    const trainers = await professionalService.getTrainersService();
    return trainers;
  } catch (error) {
    throw error;
  }
}
