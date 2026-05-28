import { prisma } from '@/infrastructure/database/prisma/client'
import { Task } from '@/shared/types/client-type'

export async function getTasksByProfessionalIdService(professionalId: string) {
  const activePurchases = await prisma.purchase.findMany({
    where: {
      professionalId,
      status: 'ACTIVE',
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      Plan: {
        include: {
          features: true,
        },
      },
    },
  })

  const tasks: Task[] = []

  // Process each purchase to extract tasks from features
  for (const purchase of activePurchases) {
    const { Plan, buyer } = purchase

    if (!Plan || !Plan.features || !buyer) continue

    // Process each feature to create a task
    for (const feature of Plan.features) {
      // Skip features that don't represent tasks
      if (!feature) continue

      let taskType: 'TRAINING' | 'DIET' | 'FEEDBACK' | 'CONSULTATION' | 'RETURN'
      let taskStatus: 'COMPLETED' | 'PENDING' | 'IN_PROGRESS'
      let taskTitle = ''
      let taskDescription = ''
      let dueDate = null

      if (feature.type === 'TRAINING_WEEK') {
        taskType = 'TRAINING'
        taskTitle = 'Create Training Plan'
        taskDescription = 'Create a training plan for the client'
        taskStatus = 'PENDING'

        if (feature.trainingWeekId) {
          taskStatus = 'COMPLETED'
        }
      } else if (feature.type === 'DIET') {
        taskType = 'DIET'
        taskTitle = 'Create Diet Plan'
        taskDescription = 'Create a diet plan for the client'
        taskStatus = 'PENDING'

        if (feature.dietId) {
          taskStatus = 'COMPLETED'
        }
      } else if (feature.type === 'FEEDBACK') {
        taskType = 'FEEDBACK'
        taskTitle = 'Enviar Feedback'
        taskDescription = feature.feedback || 'Provide feedback to the client'
        taskStatus = 'PENDING'
      } else if (feature.type === 'CONSULTATION') {
        taskType = 'CONSULTATION'
        taskTitle = 'Consulta inicial'
        taskDescription = 'Agendar consulta inicial com o cliente'
        taskStatus = 'PENDING'

        if (feature.consultationMeetingId) {
          const meeting = await prisma.meeting.findUnique({
            where: { id: feature.consultationMeetingId },
          })

          if (meeting) {
            taskStatus = meeting.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS'

            if (meeting.startTime) {
              dueDate = meeting.startTime.toISOString()
            }
          }
        }
      } else if (feature.type === 'RETURN') {
        taskType = 'RETURN'
        taskTitle = 'Consulta de retorno'
        taskDescription = 'Agendar retorno com o cliente'
        taskStatus = 'PENDING'

        // Check if there's a meeting for this return
        if (feature.returnMeetingId) {
          const meeting = await prisma.meeting.findUnique({
            where: { id: feature.returnMeetingId },
          })

          if (meeting) {
            taskStatus = meeting.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS'

            // Set due date if meeting is scheduled
            if (meeting.startTime) {
              dueDate = meeting.startTime.toISOString()
            }
          }
        }
      } else {
        continue
      }
      tasks.push({
        id: feature.id,
        type: taskType,
        title: taskTitle,
        description: taskDescription,
        clientName: buyer.name || buyer.email,
        clientId: buyer.id,
        status: taskStatus,
        purchaseId: purchase.id,
        featureId: feature.id,
        dueDate: dueDate,
      })
    }
  }

  // Sort tasks by status (pending first) and then by due date if available
  return tasks.sort((a, b) => {
    // Sort by status priority: PENDING > IN_PROGRESS > COMPLETED
    const statusPriority = { PENDING: 0, IN_PROGRESS: 1, COMPLETED: 2 }
    const statusDiff = statusPriority[a.status] - statusPriority[b.status]

    if (statusDiff !== 0) return statusDiff

    // If same status, sort by due date (if available)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }

    // Put tasks with due dates before those without
    if (a.dueDate) return -1
    if (b.dueDate) return 1

    return 0
  })
}
