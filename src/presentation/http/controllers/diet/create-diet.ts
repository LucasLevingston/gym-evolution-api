import type { FastifyReply, FastifyRequest } from 'fastify'
import { createDiet } from '@/application/diet/create-diet'
import { isProfessionalAssignedToStudent } from '@/application/training/is-professional-assigned-to-student'
import { User } from '@prisma/client'

interface Body {
  weekNumber: number
  totalCalories?: number
  totalProtein?: number
  totalCarbohydrates?: number
  totalFat?: number
  studentId?: string
}

export async function createDietController(
  request: FastifyRequest<{
    Body: Body
  }>,
  reply: FastifyReply
) {
  const { id: userId, role } = request.user as User
  const dietData = request.body

  let targetUserId = userId
  try {
    if (role === 'NUTRITIONIST' && dietData.studentId) {
      const isAssigned = await isProfessionalAssignedToStudent(
        userId,
        dietData.studentId,
        'NUTRITIONIST'
      )

      if (!isAssigned) {
        return reply.status(403).send({ message: 'You are not assigned to this student' })
      }

      targetUserId = dietData.studentId
    } else if (dietData.studentId && role !== 'NUTRITIONIST') {
      return reply
        .status(403)
        .send({ message: 'Only nutritionists can create diets for students' })
    }

    const diet = await createDiet({
      ...dietData,
      userId: targetUserId,
    })

    return diet
  } catch (error) {
    throw error
  }
}
