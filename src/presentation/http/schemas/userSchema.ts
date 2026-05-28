import { z } from 'zod'
import { dietSchema } from './dietSchema'
import { historySchema } from './historySchema'
import { trainingWeekSchema } from './newTrainingSchema'
import { weightSchema } from './weightSchema'

const professionalSettingsSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  workStartHour: z.number().min(0).max(23),
  workEndHour: z.number().min(0).max(23),
  appointmentDuration: z.number().min(15).max(240),
  workDays: z.string(),
  bufferBetweenSlots: z.number().min(0).max(60),
  maxAdvanceBooking: z.number().min(1).max(365),
  autoAcceptMeetings: z.boolean(),
  timeZone: z.string(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
})

const googleConnectionSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresAt: z.string().or(z.date()).optional(),
  scope: z.string().optional(),
  tokenType: z.string().optional(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
})

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string().optional(),
  name: z.string().optional(),
  role: z.string(),
  sex: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  birthDate: z.string().optional(),
  phone: z.string().optional(),
  currentWeight: z.string().optional(),
  currentBf: z.string().optional(),
  height: z.string().optional(),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.string().or(z.date()).optional(),

  bio: z.string().optional(),
  experience: z.number().optional(),
  rating: z.number().optional(),
  imageUrl: z.string().optional(),
  specialties: z.string().optional(),
  certifications: z.string().optional(),
  education: z.string().optional(),
  availability: z.string().optional(),
  reviews: z.string().optional(),
  googleAccessToken: z.string().optional(),
  googleRefreshToken: z.string().optional(),
  GoogleConnection: googleConnectionSchema.optional(),

  ProfessionalSettings: professionalSettingsSchema.optional(),

  history: z.array(historySchema).optional(),
  oldWeights: z.array(weightSchema).optional(),
  trainingWeeks: z.array(trainingWeekSchema).optional(),
  diets: z.array(dietSchema).optional(),

  token: z.string().optional(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
})

export const userRoleSchema = z.enum([
  'STUDENT',
  'NUTRITIONIST',
  'TRAINER',
  'ADMIN',
])

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  email: z.string().email(),
  role: z.string(),
  createdAt: z.date(),
})
