import type { FastifyReply, FastifyRequest } from 'fastify';
import { assignNutritionist } from '@/application/user/assign-nutritionist';
import { User } from '@prisma/client';

interface Body {
  studentId: string;
  nutritionistId: string;
}

export async function assignNutritionistController(
  request: FastifyRequest<{
    Body: Body;
  }>,
  reply: FastifyReply
) {
  const { role } = request.user as User;
  const { studentId, nutritionistId } = request.body;

  // Only nutritionists or admins can assign nutritionists
  if (role !== 'NUTRITIONIST' && role !== 'ADMIN') {
    return reply.status(403).send({ message: 'Forbidden' });
  }

  const relationship = await assignNutritionist(nutritionistId, studentId);

  return reply.status(201).send(relationship);
}
