import { prisma } from '@/infrastructure/database/prisma/client'
import { Client } from '@/shared/types/client-type'

export async function getClientsByProfessionalIdService(
  professionalId: string
): Promise<Client[]> {
  try {
    if (!professionalId) {
      throw new Error('O ID do profissional é obrigatório')
    }

    const purchases = await prisma.purchase.findMany({
      where: {
        professionalId: professionalId,
      },
      include: {
        buyer: true,
        Plan: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            features: true,
          },
        },
        Meeting: {
          select: {
            id: true,
            title: true,
            description: true,
            startTime: true,
            endTime: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const clientMap = new Map()

    for (const purchase of purchases) {
      const { buyer } = purchase

      if (!buyer) continue

      if (
        !clientMap.has(buyer.id) ||
        purchase.createdAt > clientMap.get(buyer.id).latestPurchaseDate
      ) {
        clientMap.set(buyer.id, {
          id: buyer.id,
          name: buyer.name || 'Cliente sem nome',
          email: buyer.email,
          phone: buyer.phone,
          sex: buyer.sex,
          birthDate: buyer.birthDate,
          currentWeight: buyer.currentWeight,
          currentBf: buyer.currentBf,
          height: buyer.height,
          imageUrl: buyer.imageUrl,
          latestPurchaseId: purchase.id,
          latestPurchaseDate: purchase.createdAt,
          latestPlanName: purchase.Plan?.name,
          purchaseStatus: purchase.status,
          isActive: purchase.status === 'ACTIVE',
          totalSpent: 0,
          purchaseCount: 0,
          tasks: [],
        })
      } else {
        // Atualiza o isActive se esta compra for ativa
        const clientData = clientMap.get(buyer.id)
        if (purchase.status === 'ACTIVE') {
          clientData.isActive = true // Define como ativo se houver uma compra ativa
        }
      }
    }

    for (const purchase of purchases) {
      const { buyer } = purchase
      if (!buyer) continue

      const clientData = clientMap.get(buyer.id)
      if (clientData) {
        clientData.totalSpent += purchase.amount || 0
        clientData.purchaseCount += 1

        if (purchase.status === 'ACTIVE' && purchase.Plan?.features) {
          for (const feature of purchase.Plan.features) {
            let taskType: 'TRAINING' | 'DIET' | 'FEEDBACK' | 'CONSULTATION' | 'RETURN'
            let taskStatus: 'COMPLETED' | 'PENDING' | 'IN_PROGRESS'
            let taskTitle = ''
            let taskDescription = ''
            let dueDate = null
            if (feature.type === 'TRAINING_WEEK') {
              taskType = 'TRAINING'
              taskTitle = 'Criar Plano de Treino'
              taskDescription = 'Criar um plano de treino para o cliente'
              taskStatus = 'PENDING'

              if (feature.trainingWeekId) {
                taskStatus = 'COMPLETED'
              }
            } else if (feature.type === 'DIET') {
              taskType = 'DIET'
              taskTitle = 'Criar Plano de Dieta'
              taskDescription = 'Criar um plano de dieta para o cliente'
              taskStatus = 'PENDING'

              if (feature.dietId) {
                taskStatus = 'COMPLETED'
              }
            } else if (feature.type === 'FEEDBACK') {
              taskType = 'FEEDBACK'
              taskTitle = 'Fornecer Feedback'
              taskDescription = feature.feedback || 'Fornecer feedback ao cliente'
              taskStatus = 'PENDING'
            } else if (feature.type === 'CONSULTATION') {
              taskType = 'CONSULTATION'
              taskTitle = 'Consulta Inicial'
              taskDescription = 'Agendar ou realizar consulta inicial com o cliente'
              taskStatus = 'PENDING'

              if (feature.consultationMeetingId) {
                const meeting = await prisma.meeting.findUnique({
                  where: { id: feature.consultationMeetingId },
                })

                if (meeting) {
                  taskStatus =
                    meeting.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS'

                  if (meeting.startTime) {
                    dueDate = meeting.startTime.toISOString()
                  }
                }
              }
            } else if (feature.type === 'RETURN') {
              taskType = 'RETURN'
              taskTitle = 'Reunião de Acompanhamento'
              taskDescription =
                'Agendar ou realizar reunião de acompanhamento com o cliente'
              taskStatus = 'PENDING'

              // Verifica se há uma reunião para este retorno
              if (feature.returnMeetingId) {
                const meeting = await prisma.meeting.findUnique({
                  where: { id: feature.returnMeetingId },
                })

                if (meeting) {
                  taskStatus =
                    meeting.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS'

                  // Define a data de vencimento se a reunião estiver agendada
                  if (meeting.startTime) {
                    dueDate = meeting.startTime.toISOString()
                  }
                }
              }
            } else {
              continue
            }

            clientData.tasks.push({
              id: feature.id,
              type: feature.type,
              title: taskTitle,
              description: taskDescription,
              status: taskStatus,
              dueDate: null,
              linkToResolve: feature.linkToResolve,
            })
          }
        }

        // Também adiciona reuniões como tarefas para completude
        if (purchase.Meeting && purchase.Meeting.length > 0) {
          for (const meeting of purchase.Meeting) {
            clientData.tasks.push({
              id: meeting.id,
              type: 'MEETING',
              title: meeting.title || 'Consulta',
              description: meeting.description || 'Consulta agendada',
              status: meeting.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
              dueDate: meeting.startTime,
            })
          }
        }
      }
    }

    const clients = Array.from(clientMap.values())

    return clients
  } catch (error) {
    console.error('Erro no getClientsByProfessionalIdService:', error)
    throw error
  }
}
