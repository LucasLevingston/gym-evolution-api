import type { FastifyReply, FastifyRequest } from 'fastify';
import { getNutritionistStudents } from '@/application/user/get-nutritionist-students';
import { User } from '@prisma/client';

export async function getNutritionistStudentsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id: nutritionistId, role } = request.user as User;

  if (role !== 'NUTRITIONIST') {
    return reply.status(403).send({ message: 'Forbidden' });
  }

  const students = await getNutritionistStudents(nutritionistId);

  return reply.send(students);
}
