import type { FastifyReply, FastifyRequest } from 'fastify';
import { assignTrainer } from '@/application/user/assign-trainer';
import { User } from '@prisma/client';

interface Body {
  studentId: string;
  trainerId: string;
}

export async function assignTrainerController(
  request: FastifyRequest<{
    Body: Body;
  }>,
  reply: FastifyReply
) {
  const { role } = request.user as User;
  const { studentId, trainerId } = request.body;

  // Only trainers or admins can assign trainers
  if (role !== 'TRAINER' && role !== 'ADMIN') {
    return reply.status(403).send({ message: 'Forbidden' });
  }

  const relationship = await assignTrainer(trainerId, studentId);

  return reply.status(201).send(relationship);
}
