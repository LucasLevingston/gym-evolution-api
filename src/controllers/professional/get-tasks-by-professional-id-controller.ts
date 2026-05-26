import { FastifyRequest } from 'fastify'
import { getTasksByProfessionalIdService } from '@/services/professional/get-tasks-by-professional-id-service'

export const getTasksByProfessionalIdController = async (
  request: FastifyRequest<{ Params: { professionalId: string } }>
) => {
  try {
    const { professionalId } = request.params

    const tasks = await getTasksByProfessionalIdService(professionalId)

    return tasks
  } catch (error) {
    throw error
  }
}
