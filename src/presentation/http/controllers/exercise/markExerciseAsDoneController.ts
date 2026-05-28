import { User } from '@prisma/client';
import { ClientError } from '@/domain/shared/errors/client-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getExerciseById } from '@/application/training/get-exercise-by-id';
import { markExerciseAsDone } from '@/application/training/mark-exercise-as-done';
import { getTrainingDayById } from '@/application/training/get-training-day-by-id';
import { getTrainingWeekById } from '@/application/training/get-training-week-by-id';
import { isTrainerAssignedToStudent } from '@/application/training/is-trainer-assigned-to-student';

export const markExerciseAsDoneController = async (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const { id: userId, role } = request.user as User;
  const exercise = await getExerciseById(id);
  const trainingDay = await getTrainingDayById(exercise.trainingDayId!);
  const trainingWeek = await getTrainingWeekById(trainingDay.trainingWeekId!);

  if (role === 'STUDENT' && trainingWeek.userId !== userId) {
    throw new ClientError('Forbidden');
  }

  if (role === 'TRAINER' && trainingWeek.userId !== userId) {
    const isAssigned = await isTrainerAssignedToStudent(userId, trainingWeek.userId);

    if (!isAssigned) {
      throw new ClientError('You are not assigned to this student');
    }
  }

  const updatedExercise = await markExerciseAsDone(id);

  return reply.send(updatedExercise);
};
