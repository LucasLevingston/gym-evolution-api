import { prisma } from '@/infrastructure/database/prisma/client'

// Comprehensive metrics service that fetches all metrics data at once
export async function getAllProfessionalMetrics(
  professionalId: string,
  timeRange: string
) {
  try {
    // Determine date ranges based on timeRange
    const now = new Date()
    const startDate = new Date()
    const previousStartDate = new Date()

    if (timeRange === 'week') {
      startDate.setDate(now.getDate() - 7)
      previousStartDate.setDate(now.getDate() - 14)
    } else if (timeRange === 'month') {
      startDate.setMonth(now.getMonth() - 1)
      previousStartDate.setMonth(now.getMonth() - 2)
    } else if (timeRange === 'quarter') {
      startDate.setMonth(now.getMonth() - 3)
      previousStartDate.setMonth(now.getMonth() - 6)
    } else if (timeRange === 'year') {
      startDate.setFullYear(now.getFullYear() - 1)
      previousStartDate.setFullYear(now.getFullYear() - 2)
    } else {
      // Default to month if invalid timeRange
      startDate.setMonth(now.getMonth() - 1)
      previousStartDate.setMonth(now.getMonth() - 2)
    }

    // Get professional data
    const professional = await prisma.user.findUnique({
      where: {
        id: professionalId,
      },
      select: {
        id: true,
        name: true,
        rating: true,
        reviews: {
          include: {
            User: {
              select: {
                name: true,
                email: true,
                imageUrl: true,
              },
            },
          },
        },
        experience: true,
        approvalStatus: true,
        plans: {
          select: {
            id: true,
            name: true,
            price: true,
            purchases: {
              where: {
                paymentStatus: 'COMPLETED',
              },
              select: {
                id: true,
                amount: true,
                createdAt: true,
                buyerId: true,
              },
            },
          },
        },
        meetingsAsProfessional: {
          select: {
            id: true,
            status: true,
            startTime: true,
            endTime: true,
            studentId: true,
          },
        },
        purchasesAsProfessional: {
          where: {
            paymentStatus: 'COMPLETED',
          },
          select: {
            id: true,
            amount: true,
            createdAt: true,
            buyerId: true,
            planId: true,
          },
        },

        ProfessionalSubscription: {
          where: {
            status: 'ACTIVE',
          },
          select: {
            id: true,
            subscriptionPlan: true,
          },
        },
      },
    })

    if (!professional) {
      throw new Error('Professional not found')
    }

    // Get all purchases (including current and previous periods)
    const allPurchases = await prisma.purchase.findMany({
      where: {
        professionalId,
        paymentStatus: 'COMPLETED',
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
        buyerId: true,
        planId: true,
      },
    })

    // Get all purchase attempts for conversion rate
    const allPurchaseAttempts = await prisma.purchase.count({
      where: {
        professionalId,
      },
    })

    // Get clients with multiple purchases for retention rate
    const clientsWithMultiplePurchases = await prisma.purchase.groupBy({
      by: ['buyerId'],
      where: {
        professionalId: professionalId,
        paymentStatus: 'COMPLETED',
      },
      having: {
        buyerId: {
          _count: {
            gt: 1,
          },
        },
      },
    })

    return {
      professional,
      allPurchases,
      allPurchaseAttempts,
      clientsWithMultiplePurchases,
      timeRanges: {
        now,
        startDate,
        previousStartDate,
      },
    }
  } catch (error) {
    console.error('Error fetching professional metrics:', error)
    throw error
  }
}
