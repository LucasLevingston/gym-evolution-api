import { prisma } from '@/infrastructure/database/prisma/client'
import type { CreatePlanInput } from '@/presentation/http/schemas/plan-schema'

export async function createPlanService(data: CreatePlanInput) {
  const workflowMetadata = {
    requiresInitialMeeting: data.requiresInitialMeeting,
    requiresFollowUp: data.requiresFollowUp,
    maxFollowUps: data.maxFollowUps,
    isCustom: data.isCustom,
  }

  return prisma.plan.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      duration: data.duration,
      professionalId: data.professionalId,
      metadata: JSON.stringify(workflowMetadata),

      features: { create: data.features },
    },
  })
}
