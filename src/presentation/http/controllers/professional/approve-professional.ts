import { FastifyRequest } from 'fastify'
import * as professionalService from '@/application/professional'
import { createNotificationService } from '@/application/notification'

export async function approveProfessionalController(
  request: FastifyRequest<{ Params: { id: string } }>
) {
  const { id } = request.params
  try {
    const professionals = await professionalService.approveProfessionalService(id)

    await createNotificationService({
      message: 'Seja bem vindo ao time de profissionais do time GymEvolution',
      title: 'Você foi aprovado como profissional',
      type: 'success',
      userId: id,
      link: '/',
    })

    return professionals
  } catch (error) {
    throw error
  }
}
