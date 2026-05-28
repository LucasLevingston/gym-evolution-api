import { prisma } from '@/infrastructure/database/prisma/client'
import { MealTypeEnum } from '@prisma/client'

interface CreateDietForClientInput {
  weekNumber: number
  totalCalories?: number
  totalProtein?: number
  totalCarbohydrates?: number
  totalFat?: number
  clientId: string
  professionalId: string
  purchaseId: string
  featureId: string
  meals: MealInput[]
}

interface MealInput {
  name: string
  mealType: MealTypeEnum
  day: number
  hour: string
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  mealItems: MealItemInput[]
}

interface MealItemInput {
  name: string
  quantity: string
  quantityType: string
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  isSubstitution?: boolean
  originalItemId?: string
}

export async function createDietForClientService(data: CreateDietForClientInput) {
  try {
    const feature = await prisma.feature.findFirst({
      where: {
        id: data.featureId,
        plan: {
          purchases: {
            some: {
              id: data.purchaseId,
              professionalId: data.professionalId,
              buyerId: data.clientId,
            },
          },
        },
        type: 'DIET',
      },
    })

    if (!feature) {
      throw new Error('Feature não encontrada ou não pertence à compra especificada')
    }

    if (feature.dietId) {
      throw new Error('Já existe uma dieta criada para esta feature')
    }

    const diet = await prisma.$transaction(async (tx) => {
      const createdDiet = await tx.diet.create({
        data: {
          weekNumber: data.weekNumber,
          totalCalories: data.totalCalories,
          totalProtein: data.totalProtein,
          totalCarbohydrates: data.totalCarbohydrates,
          totalFat: data.totalFat,
          isCurrent: true,
          userId: data.clientId,
        },
      })

      // Criar as refeições com seus itens
      for (const meal of data.meals) {
        const createdMeal = await tx.meal.create({
          data: {
            name: meal.name,
            mealType: meal.mealType,
            day: meal.day,
            hour: meal.hour,
            calories: meal.calories,
            protein: meal.protein,
            carbohydrates: meal.carbohydrates,
            fat: meal.fat,
            isCompleted: false,
            dietId: createdDiet.id,
          },
        })

        // Criar os itens para cada refeição
        for (const item of meal.mealItems) {
          await tx.mealItems.create({
            data: {
              name: item.name,
              quantity: item.quantity,
              quantityType: item.quantityType,
              calories: item.calories,
              protein: item.protein,
              carbohydrates: item.carbohydrates,
              fat: item.fat,
              isCompleted: false,
              isSubstitution: item.isSubstitution || false,
              originalItemId: item.originalItemId,
              mealId: createdMeal.id,
            },
          })
        }
      }

      // Atualizar a feature com o ID da dieta criada
      await tx.feature.update({
        where: { id: data.featureId },
        data: {
          dietId: createdDiet.id,
        },
      })

      // Criar uma notificação para o cliente
      await tx.notification.create({
        data: {
          title: 'Nova Dieta Disponível',
          message: `Seu profissional criou uma nova dieta para você: Semana ${data.weekNumber}`,
          type: 'DIET',
          read: false,
          link: `/diet/${createdDiet.id}`,
          userId: data.clientId,
        },
      })

      return createdDiet
    })

    return diet
  } catch (error) {
    throw error
  }
}
