import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/infrastructure/database/prisma/client';
import { DayOfWeekEnum } from '@prisma/client';

export async function createTrainingDayController(
  request: FastifyRequest<{
    Body: {
      muscleGroups: string[];
      dayOfWeek: DayOfWeekEnum;
      isCompleted?: boolean;
      comments?: string;
      trainingWeekId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const trainingDay = await prisma.trainingDay.create({
      data: {
        ...request.body,
      },
    });
    return reply.code(201).send(trainingDay);
  } catch (error) {
    throw error;
  }
}
