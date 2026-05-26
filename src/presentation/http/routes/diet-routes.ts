import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { createDietController } from '@/presentation/http/controllers/diet/create-diet'
import { deleteDietController } from '@/presentation/http/controllers/diet/delete-diet'
import { getAllDietsController } from '@/presentation/http/controllers/diet/get-all-diets'
import { getDietByIdController } from '@/presentation/http/controllers/diet/get-diet-by-id'
import { updateDietController } from '@/presentation/http/controllers/diet/update-diet'
import { authenticate } from '@/presentation/http/middlewares/authenticate'
import { idParamSchema } from '@/presentation/http/schemas/common-schemas'
import { errorResponseSchema } from '@/presentation/http/schemas/error-schema'

export async function dietRoutes(server: FastifyInstance) {
  server.addHook('onRequest', authenticate)

  const createDietSchema = z.object({
    weekNumber: z.number().int().positive(),
    totalCalories: z.number().int().optional(),
    totalProtein: z.number().optional(),
    totalCarbohydrates: z.number().optional(),
    totalFat: z.number().optional(),
    studentId: z.string().uuid().optional(),
  })

  const dietResponseSchema = z.object({
    id: z.string().uuid(),
    weekNumber: z.number(),
    totalCalories: z.number().nullable(),
    totalProtein: z.number().nullable(),
    totalCarbohydrates: z.number().nullable(),
    totalFat: z.number().nullable(),
    userId: z.string().uuid().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })

  server.post(
    '/',
    // {
    //   schema: {
    //     body: createDietSchema,
    //     response: {
    //       201: dietResponseSchema,
    //       401: errorResponseSchema,
    //       403: errorResponseSchema,
    //       409: errorResponseSchema,
    //       400: errorResponseSchema,
    //       500: errorResponseSchema,
    //     },
    //     tags: ['diet'],
    //     summary: 'Create diet',
    //     description: 'Create a new diet for a user',
    //     security: [{ bearerAuth: [] }],
    //   },
    // },
    createDietController
  )

  const getAllDietsQuerySchema = z.object({
    studentId: z.string().uuid().optional(),
  })

  const mealResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string().nullable(),
    calories: z.number().nullable(),
    protein: z.number().nullable(),
    carbohydrates: z.number().nullable(),
    fat: z.number().nullable(),
    servingSize: z.string().nullable(),
    mealType: z.string().nullable(),
    day: z.number().nullable(),
    hour: z.string().nullable(),
    isCompleted: z.boolean().nullable(),
    dietId: z.string().uuid().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })

  const getAllDietsResponseSchema = z.array(
    dietResponseSchema.extend({
      meals: z.array(mealResponseSchema),
    })
  )

  server.get(
    '/',
    {
      schema: {
        querystring: getAllDietsQuerySchema,
        response: {
          200: getAllDietsResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['diet'],
        summary: 'Get all diets',
        description: 'Get all diets for a user',
        security: [{ bearerAuth: [] }],
      },
    },
    getAllDietsController
  )

  // Get diet by ID schema
  const mealItemResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    quantity: z.number(),
    quantityType: z.string().default('g'),
    calories: z.number().nullable(),
    protein: z.number().nullable(),
    carbohydrates: z.number().nullable(),
    fat: z.number().nullable(),
    isCompleted: z.boolean().default(false),
    isSubstitution: z.boolean().default(false),
    originalItemId: z.string().uuid().nullable(),
    mealId: z.string().uuid().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })

  const getDietByIdResponseSchema = dietResponseSchema.extend({
    meals: z.array(
      mealResponseSchema.extend({
        mealItems: z.array(
          mealItemResponseSchema.extend({
            substitutions: z.array(mealItemResponseSchema).optional(),
          })
        ),
      })
    ),
  })

  server.get(
    '/:id',
    // {
    //   schema: {
    //     params: idParamSchema,
    //     response: {
    //       200: getDietByIdResponseSchema,
    //       401: errorResponseSchema,
    //       403: errorResponseSchema,
    //       404: errorResponseSchema,
    //       500: errorResponseSchema,
    //     },
    //     tags: ['diet'],
    //     summary: 'Get diet by ID',
    //     description: 'Get a diet by ID',
    //     security: [{ bearerAuth: [] }],
    //   },
    // },
    getDietByIdController
  )

  // Define a recursive schema for meal items with substitutions
  const mealItemSchema: any = z.object({
    id: z.string(), // Changed from z.string().uuid().optional()
    name: z.string(),
    quantity: z.number(),
    quantityType: z.string().default('g'),
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbohydrates: z.number().optional(),
    fat: z.number().optional(),
    isCompleted: z.boolean().optional(),
    isSubstitution: z.boolean().optional(),
    originalItemId: z.string().nullable().optional(),
  })

  // Add the recursive substitutions property
  mealItemSchema.extend({
    substitutions: z.array(mealItemSchema).optional(),
  })

  const mealSchema = z.object({
    id: z.string(), // Changed from z.string().uuid().optional()
    name: z.string(),
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbohydrates: z.number().optional(),
    fat: z.number().optional(),
    mealType: z.string().optional(),
    day: z.number(),
    hour: z.string(),
    isCompleted: z.boolean().optional(),
    mealItems: z.array(mealItemSchema).optional(),
  })

  const updateDietSchema = z.object({
    weekNumber: z.number().int().positive().optional(),
    totalCalories: z.number().int().optional(),
    totalProtein: z.number().optional(),
    totalCarbohydrates: z.number().optional(),
    totalFat: z.number().optional(),
    meals: z.array(mealSchema).optional(),
  })

  server.put(
    '/:id',
    // {
    //   schema: {
    //     params: idParamSchema,
    //     body: updateDietSchema,
    //     response: {
    //       200: getDietByIdResponseSchema,
    //       401: errorResponseSchema,
    //       403: errorResponseSchema,
    //       404: errorResponseSchema,
    //       400: errorResponseSchema,
    //       500: errorResponseSchema,
    //     },
    //     tags: ['diet'],
    //     summary: 'Update diet',
    //     description: 'Update a diet by ID',
    //     security: [{ bearerAuth: [] }],
    //   },
    // },
    updateDietController
  )

  const deleteDietResponseSchema = z.object({
    message: z.string(),
  })

  server.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: deleteDietResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['diet'],
        summary: 'Delete diet',
        description: 'Delete a diet by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    deleteDietController
  )
}
