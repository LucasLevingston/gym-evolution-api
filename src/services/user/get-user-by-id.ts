import { prisma } from '@/lib/prisma'
import { getClientsByProfessionalIdService } from '@/services/professional/get-clients-by-professional-id'
import { getTasksByProfessionalIdService } from '@/services/professional/get-tasks-by-professional-id-service'
import { Client, Task } from '@/types/client-type'

export async function getUserByIdService(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      history: true,
      oldWeights: true,
      trainingWeeks: {
        include: {
          trainingDays: {
            include: {
              exercises: {
                include: {
                  seriesResults: true,
                },
              },
            },
          },
        },
      },
      ProfessionalSettings: true,
      GoogleConnection: true,
      plans: {
        include: {
          features: true,
        },
      },
      diets: {
        include: {
          meals: {
            include: { mealItems: true },
          },
        },
      },
      purchasesAsProfessional: {
        include: {
          buyer: {
            select: {
              name: true,
              imageUrl: true,
              oldWeights: true,
            },
          },
          Plan: {
            include: {
              features: true,
            },
          },
        },
      },
      purchasesAsBuyer: {
        include: {
          buyer: {
            select: {
              name: true,
              imageUrl: true,
              oldWeights: true,
            },
          },
          professional: {
            select: {
              imageUrl: true,
              name: true,
              id: true,
            },
          },
          Plan: {
            include: {
              features: true,
            },
          },
        },
      },
    },
  })

  if (user?.role === 'NUTRITIONIST' || user?.role === 'TRAINER') {
    const clients: Client[] = await getClientsByProfessionalIdService(id)
    const tasks: Task[] = await getTasksByProfessionalIdService(id)
    return { ...user, tasks, clients }
  }

  return user
}
