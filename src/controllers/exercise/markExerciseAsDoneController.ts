import { User } from '@prisma/client';
import { ClientError } from '@/errors/client-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getExerciseById } from '@/services/exercise/get-exercise-by-id';
import { markExerciseAsDone } from '@/services/exercise/mark-exercise-as-done';
import { getTrainingDayById } from '@/services/training-day/get-training-day-by-id';
import { getTrainingWeekById } from '@/services/training-week/get-training-week-by-id';
import { isTrainerAssignedToStudent } from '@/services/training-week/is-trainer-assigned-to-student';

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
