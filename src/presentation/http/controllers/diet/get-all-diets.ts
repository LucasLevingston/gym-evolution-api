import type { FastifyReply, FastifyRequest } from 'fastify'
import { getAllDiets } from '@/application/diet/get-all-diets'
import { isProfessionalAssignedToStudent } from '@/application/training/is-professional-assigned-to-student'
import { User } from '@prisma/client'

interface Querystring {
  studentId?: string
}

export async function getAllDietsController(
  request: FastifyRequest<{
    Querystring: Querystring
  }>,
  reply: FastifyReply
) {
  try {
    const { id: userId, role } = request.user as User
    const { studentId } = request.query

    // Determine the target user ID
    let targetUserId = userId

    // If a nutritionist is viewing a student's diets
    if (role === 'NUTRITIONIST' && studentId) {
      // Check if the nutritionist is assigned to this student
      const isAssigned = await isProfessionalAssignedToStudent(
        userId,
        studentId,
        'NUTRITIONIST'
      )

      if (!isAssigned) {
        return reply.status(403).send({ message: 'You are not assigned to this student' })
      }

      targetUserId = studentId
    } else if (studentId && role === 'STUDENT') {
      return reply.status(403).send({ message: 'Students can only view their own diets' })
    }

    const diets = await getAllDiets(targetUserId)

    return reply.send(diets)
  } catch (error) {
    throw error
  }
}
