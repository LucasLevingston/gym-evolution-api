import { prisma } from '@/infrastructure/database/prisma/client'
import type { UpdatePlanInput } from '@/presentation/http/schemas/plan-schema'

export async function updatePlanService(id: string, data: UpdatePlanInput): Promise<any> {
  const { features, professionalId, ...planData } = data

  const currentPlan = await prisma.plan.findUnique({
    where: { id },
    include: { features: true },
  })

  if (!currentPlan) {
    throw new Error(`Plan with id ${id} not found`)
  }

  const incomingFeatureIds = new Set(features?.map((feature) => feature.id) || [])

  const featuresToDelete = currentPlan.features
    .filter((feature) => feature.id && !incomingFeatureIds.has(feature.id))
    .map((feature) => feature.id)

  const plan = await prisma.$transaction(async (tx) => {
    if (featuresToDelete.length > 0) {
      await tx.feature.deleteMany({
        where: {
          id: {
            in: featuresToDelete,
          },
        },
      })
    }

    return tx.plan.update({
      where: { id },
      data: {
        ...planData,
        ...(professionalId && {
          professional: {
            connect: { id: professionalId },
          },
        }),
        features: {
          upsert:
            features?.map((feature) => {
              const { planId, ...featureData } = feature

              return {
                where: { id: feature.id },
                create: featureData,
                update: featureData,
              }
            }) || [],
        },
      },
      include: {
        features: true,
        professional: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  })

  return plan
}
