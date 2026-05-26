import { z } from 'zod'
import { exerciseSchema } from './exerciseSchema'

export const dayOfWeekEnum = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
])

export const trainingDaySchema = z.object({
  id: z.string().uuid().optional(),
  group: z.string().optional(),
  dayOfWeek: dayOfWeekEnum.optional(),
  done: z.boolean().optional(),
  comments: z.string().optional().nullable(),
  exercises: z.array(exerciseSchema).optional(),
})
