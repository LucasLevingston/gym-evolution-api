import { prisma } from '../../lib/prisma'
import { ClientError } from '../../errors/client-error'

export async function getDietById(id: string) {
  const diet = await prisma.diet.findUnique({
    where: { id },
    include: {
      Feature: {
        include: {
          plan: {
            include: {
              purchases: {
                where: {
                  status: 'ACTIVE',
                },
                include: {
                  buyer: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      imageUrl: true,
                    },
                  },
                  professional: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
                orderBy: {
                  createdAt: 'desc',
                },
                take: 1,
              },
            },
          },
        },
      },
      meals: {
        include: {
          mealItems: true,
        },
      },
      User: {
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  })

  if (!diet) {
    throw new ClientError('Diet not found')
  }

  return diet
}
