import type { FastifyReply, FastifyRequest } from 'fastify';
import { getTrainerStudents } from '@/application/user/get-trainer-students';
import { User } from '@prisma/client';

export async function getTrainerStudentsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id: trainerId, role } = request.user as User;

  if (role !== 'TRAINER') {
    return reply.status(403).send({ message: 'Forbidden' });
  }

  const students = await getTrainerStudents(trainerId);

  return reply.send(students);
}
