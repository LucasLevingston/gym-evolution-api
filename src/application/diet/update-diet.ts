import type { Diet, Meal, MealItems } from '@prisma/client';
import { prisma } from '@/infrastructure/database/prisma/client';
import { createHistoryEntry } from '@/application/history/create-history-entry';

interface MealItemWithSubstitutions extends MealItems {
  substitutions?: MealItemWithSubstitutions[];
}

interface MealWithItems extends Meal {
  mealItems?: MealItemWithSubstitutions[];
}

interface DietWithMeals extends Diet {
  meals?: MealWithItems[];
}

export async function updateDiet(dietId: string, data: any) {
  try {
    const { meals, ...dietData } = data;

    const updatedDiet = await prisma.diet.update({
      where: { id: dietId },
      data: {
        weekNumber: dietData.weekNumber || 1,
        totalCalories: dietData.totalCalories || 0,
        totalProtein: dietData.totalProtein || 0,
        totalCarbohydrates: dietData.totalCarbohydrates || 0,
        totalFat: dietData.totalFat || 0,
        isCurrent: dietData.isCurrent || false,
        userId: dietData.userId,
      },
      include: {
        meals: {
          include: {
            mealItems: true,
          },
        },
      },
    });

    if (meals && Array.isArray(meals) && meals.length > 0) {
      const existingMealIds = updatedDiet.meals.map((meal) => meal.id);

      for (const meal of meals) {
        if (existingMealIds.includes(meal.id)) {
          await updateMeal(meal);
        } else {
          await createMeal(dietId, meal);
        }
      }

      const updatedMealIds = meals.map((meal) => meal.id);
      const mealsToDelete = existingMealIds.filter((id) => !updatedMealIds.includes(id));

      if (mealsToDelete.length > 0) {
        await prisma.meal.deleteMany({
          where: {
            id: {
              in: mealsToDelete,
            },
          },
        });
      }
    }

    const diet = await prisma.diet.findUnique({
      where: { id: dietId },
      select: { userId: true },
    });

    if (diet?.userId) {
      await createHistoryEntry(
        diet.userId,
        `Diet for week ${dietData.weekNumber} updated`
      );
    }

    // Fetch the updated diet with all related data
    const finalDiet = await prisma.diet.findUnique({
      where: { id: dietId },
      include: {
        meals: {
          include: {
            mealItems: true,
          },
        },
      },
    });

    return finalDiet;
  } catch (error) {
    throw error;
  }
}

// Helper function to update a meal
async function updateMeal(meal: any) {
  const { mealItems, ...mealData } = meal;

  // Update the meal
  const updatedMeal = await prisma.meal.update({
    where: { id: meal.id },
    data: {
      name: mealData.name,
      calories: mealData.calories || 0,
      protein: mealData.protein || 0,
      carbohydrates: mealData.carbohydrates || 0,
      fat: mealData.fat || 0,
      mealType: mealData.mealType,
      day: mealData.day,
      hour: mealData.hour,
      isCompleted: mealData.isCompleted || false,
    },
    include: {
      mealItems: true,
    },
  });

  // If there are meal items to update
  if (mealItems && Array.isArray(mealItems) && mealItems.length > 0) {
    // Get existing meal item IDs
    const existingItemIds = updatedMeal.mealItems.map((item) => item.id);

    // Process each meal item
    for (const item of mealItems) {
      if (existingItemIds.includes(item.id)) {
        // Update existing meal item
        await updateMealItem(item);
      } else {
        // Create new meal item
        await createMealItem(meal.id, item);
      }
    }

    // Delete meal items that are no longer in the updated meal
    const updatedItemIds = mealItems.map((item) => item.id);
    const itemsToDelete = existingItemIds.filter((id) => !updatedItemIds.includes(id));

    if (itemsToDelete.length > 0) {
      await prisma.mealItems.deleteMany({
        where: {
          id: {
            in: itemsToDelete,
          },
        },
      });
    }
  }

  return updatedMeal;
}

// Helper function to create a new meal
async function createMeal(dietId: string, meal: any) {
  const { mealItems, ...mealData } = meal;

  // Create the meal
  const newMeal = await prisma.meal.create({
    data: {
      name: mealData.name,
      calories: mealData.calories || 0,
      protein: mealData.protein || 0,
      carbohydrates: mealData.carbohydrates || 0,
      fat: mealData.fat || 0,
      mealType: mealData.mealType,
      day: mealData.day,
      hour: mealData.hour,
      isCompleted: mealData.isCompleted || false,
      dietId: dietId,
    },
  });

  // Create meal items if they exist
  if (mealItems && Array.isArray(mealItems) && mealItems.length > 0) {
    for (const item of mealItems) {
      await createMealItem(newMeal.id, item);
    }
  }

  return newMeal;
}

// Helper function to update a meal item
async function updateMealItem(item: any) {
  const { substitutions, ...itemData } = item;

  // Update the meal item
  const updatedItem = await prisma.mealItems.update({
    where: { id: item.id },
    data: {
      name: itemData.name,
      quantity: itemData.quantity,
      quantityType: itemData.quantityType,
      calories: itemData.calories || 0,
      protein: itemData.protein || 0,
      carbohydrates: itemData.carbohydrates || 0,
      fat: itemData.fat || 0,
      isCompleted: itemData.isCompleted || false,
      isSubstitution: itemData.isSubstitution || false,
      originalItemId: itemData.originalItemId,
    },
  });

  // Handle substitutions if they exist
  if (substitutions && Array.isArray(substitutions) && substitutions.length > 0) {
    // Get existing substitution IDs
    const existingSubIds = await prisma.mealItems.findMany({
      where: { originalItemId: item.id },
      select: { id: true },
    });

    const existingSubIdList = existingSubIds.map((sub) => sub.id);

    // Process each substitution
    for (const sub of substitutions) {
      if (existingSubIdList.includes(sub.id)) {
        // Update existing substitution
        await updateMealItem(sub);
      } else {
        // Create new substitution
        await createMealItem(updatedItem.mealId!, {
          ...sub,
          isSubstitution: true,
          originalItemId: item.id,
        });
      }
    }

    // Delete substitutions that are no longer in the updated item
    const updatedSubIds = substitutions.map((sub) => sub.id);
    const subsToDelete = existingSubIdList.filter((id) => !updatedSubIds.includes(id));

    if (subsToDelete.length > 0) {
      await prisma.mealItems.deleteMany({
        where: {
          id: {
            in: subsToDelete,
          },
        },
      });
    }
  }

  return updatedItem;
}

// Helper function to create a new meal item
async function createMealItem(mealId: string, item: any) {
  const { substitutions, ...itemData } = item;

  // Create the meal item
  const newItem = await prisma.mealItems.create({
    data: {
      name: itemData.name,
      quantity: itemData.quantity,
      quantityType: itemData.quantityType,
      calories: itemData.calories || 0,
      protein: itemData.protein || 0,
      carbohydrates: itemData.carbohydrates || 0,
      fat: itemData.fat || 0,
      isCompleted: itemData.isCompleted || false,
      isSubstitution: itemData.isSubstitution || false,
      originalItemId: itemData.originalItemId,
      mealId: mealId,
    },
  });

  // Create substitutions if they exist
  if (substitutions && Array.isArray(substitutions) && substitutions.length > 0) {
    for (const sub of substitutions) {
      await createMealItem(mealId, {
        ...sub,
        isSubstitution: true,
        originalItemId: newItem.id,
      });
    }
  }

  return newItem;
}
