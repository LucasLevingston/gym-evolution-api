import { z } from 'zod';
import { mealItemsSchema } from './mealItemsSchema';

export const mealTypeEnum = z.enum([
  'BREAKFAST',
  'MORNING_SNACK',
  'LUNCH',
  'AFTERNOON_SNACK',
  'DINNER',
  'NIGHT_SNACK',
])

export const mealSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional().nullable(),
  calories: z.number().int().positive().optional().nullable(),
  protein: z.number().positive().optional().nullable(),
  carbohydrates: z.number().positive().optional().nullable().nullable(),
  fat: z.number().positive().optional().nullable(),
  servingSize: z.string().optional().nullable(),
  mealType: mealTypeEnum.optional().nullable(),
  day: z.number().int().positive().optional().nullable(),
  hour: z.string().optional().nullable(),
  isCompleted: z.boolean().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  mealItems: z.array(mealItemsSchema).optional(),
});
