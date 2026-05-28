import type { FastifyReply, FastifyRequest } from 'fastify'
import { getDietById } from '../../services/diet/get-diet-by-id'
import { updateDiet } from '../../services/diet/update-diet'
import { isProfessionalAssignedToStudent } from '../../services/training-week/is-professional-assigned-to-student'
import type { User } from '@prisma/client'
import { ClientError } from '@/errors/client-error'

interface Params {
  id: string
}

interface UpdateDietBody {
  weekNumber?: number
  totalCalories?: number
  totalProtein?: number
  totalCarbohydrates?: number
  totalFat?: number
  meals?: Array<{
    id: string
    name: string
    calories?: number
    protein?: number
    carbohydrates?: number
    fat?: number
    mealType?: string
    day?: number
    hour?: string
    isCompleted?: boolean
    mealItems?: Array<{
      id: string
      name: string
      quantity: number
      quantityType: string
      calories?: number
      protein?: number
      carbohydrates?: number
      fat?: number
      isCompleted?: boolean
      isSubstitution?: boolean
      originalItemId?: string | null
      substitutions?: any[]
    }>
  }>
}

export async function updateDietController(
  request: FastifyRequest<{
    Params: Params
    Body: UpdateDietBody
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params
    const { id: userId, role } = request.user as User
    const updateData = request.body

    const diet = await getDietById(id)
    if (!diet) {
      throw new ClientError('Diet not found')
    }

    if (role === 'NUTRITIONIST' && diet.userId !== userId) {
      const isAssigned = await isProfessionalAssignedToStudent(
        userId,
        diet.userId!,
        'NUTRITIONIST'
      )

      if (!isAssigned) {
        throw new ClientError('You are not assigned to this student')
      }
    } else if (role !== 'NUTRITIONIST' && role !== 'ADMIN' && diet.userId !== userId) {
      // throw new ClientError('Forbidden');
    }

    const preparedData = {
      ...diet,
      ...updateData,
      id,
      meals: Array.isArray(updateData.meals) ? updateData.meals : [],
    }

    const updatedDiet = await updateDiet(id, preparedData)

    return reply.send(updatedDiet)
  } catch (error) {
    throw error
  }
}
