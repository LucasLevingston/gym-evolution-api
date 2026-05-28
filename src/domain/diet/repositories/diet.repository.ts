import type { Diet, Meal, MealItems } from '@prisma/client'

export interface IDietRepository {
  findById(id: string): Promise<Diet | null>
  findAllByUserId(userId: string): Promise<Diet[]>
  create(data: Partial<Diet>): Promise<Diet>
  update(id: string, data: Partial<Diet>): Promise<Diet>
  delete(id: string): Promise<void>
}

export interface IMealRepository {
  findById(id: string): Promise<Meal | null>
  findAllByDietId(dietId: string): Promise<Meal[]>
  create(data: Partial<Meal>): Promise<Meal>
  update(id: string, data: Partial<Meal>): Promise<Meal>
  delete(id: string): Promise<void>
  markAsCompleted(id: string): Promise<Meal>
}

export interface IMealItemsRepository {
  findById(id: string): Promise<MealItems | null>
  findAllByMealId(mealId: string): Promise<MealItems[]>
  create(data: Partial<MealItems>): Promise<MealItems>
  update(id: string, data: Partial<MealItems>): Promise<MealItems>
  delete(id: string): Promise<void>
}
