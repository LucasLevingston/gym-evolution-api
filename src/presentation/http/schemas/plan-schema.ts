import { z } from 'zod'

export enum FeatureType {
  TRAINING_WEEK = 'TRAINING_WEEK',
  DIET = 'DIET',
  FEEDBACK = 'FEEDBACK',
  CONSULTATION = 'CONSULTATION',
  RETURN = 'RETURN',
  MATERIALS = 'MATERIALS',
}

const FeatureSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(FeatureType),

  // Optional fields based on feature type
  trainingWeekId: z.string().optional(),
  dietId: z.string().optional(),
  feedback: z.string().optional(),
  scheduledDay: z.number().optional(),
  consultationMeetingId: z.string().optional(),
  returnMeetingId: z.string().optional(),
  linkToResolve: z.string().optional(),

  // Relation fields
  planId: z.string().optional(),
  createdAt: z.union([z.date(), z.string()]).optional(),
  updatedAt: z.union([z.date(), z.string()]).optional(),
})

// Define the CreatePlanInput schema
export const CreatePlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be a positive number'),
  duration: z.number().int().min(1, 'Duration must be at least 1 day'),
  isActive: z.boolean().default(true),
  professionalId: z.string(),
  isCustom: z.boolean().default(true),
  // Features can be either strings (old format) or Feature objects (new format)
  features: z.array(FeatureSchema),
  // Optional fields that will be set by the controller
  requiresInitialMeeting: z.boolean().optional(),
  requiresFollowUp: z.boolean().optional(),
  maxFollowUps: z.number().optional(),
  feedbackCount: z.number().optional(),
  featureDetails: z.array(FeatureSchema).optional(),
})

export type CreatePlanInput = z.infer<typeof CreatePlanSchema>
export const updatePlanSchema = CreatePlanSchema.partial()
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>

// Predefined features for different professional types
export function getPredefinedFeatures(professionalType: 'NUTRITIONIST' | 'TRAINER') {
  const commonFeatures = [
    { id: 'feedback', label: 'Feedback Semanal' },
    { id: 'consultation', label: 'Consulta Online' },
    { id: 'followup', label: 'Retorno Mensal' },
    { id: 'materials', label: 'Acesso a Materiais Exclusivos' },
  ]

  const nutritionistFeatures = [
    { id: 'diet', label: 'Plano Alimentar Personalizado' },
    ...commonFeatures,
  ]

  const trainerFeatures = [
    { id: 'training', label: 'Plano de Treino Semanal' },
    ...commonFeatures,
  ]

  return professionalType === 'NUTRITIONIST' ? nutritionistFeatures : trainerFeatures
}

// Export the schema
export default CreatePlanSchema
