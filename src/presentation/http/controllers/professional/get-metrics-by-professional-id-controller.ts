import { getAllProfessionalMetrics } from '@/application/professional/get-metrics-by-professional-id-service'
import { Review } from '@prisma/client'
import { FastifyRequest } from 'fastify'
import { getClientsByProfessionalIdService } from '@/application/professional/get-clients-by-professional-id'

export async function getMetricsByProfessionalIdController(
  request: FastifyRequest<{
    Params: {
      professionalId: string
    }
    Querystring: {
      timeRange: string
    }
  }>
) {
  const { professionalId } = request.params
  const { timeRange } = request.query

  try {
    const data = await getAllProfessionalMetrics(professionalId, timeRange)
    const {
      professional,
      allPurchases,
      allPurchaseAttempts,
      clientsWithMultiplePurchases,
      timeRanges,
    } = data

    const allClients = await getClientsByProfessionalIdService(professionalId)

    const currentPeriodPurchases = allPurchases.filter(
      (purchase) => new Date(purchase.createdAt) >= timeRanges.startDate
    )

    const previousPeriodPurchases = allPurchases.filter(
      (purchase) =>
        new Date(purchase.createdAt) >= timeRanges.previousStartDate &&
        new Date(purchase.createdAt) < timeRanges.startDate
    )

    const totalClients = allClients.filter((client) => client.isActive).length

    const totalRevenue = currentPeriodPurchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    )
    const totalSales = currentPeriodPurchases.length
    const previousPeriodSales = previousPeriodPurchases.length
    const growthRate =
      previousPeriodSales > 0
        ? Math.round(((totalSales - previousPeriodSales) / previousPeriodSales) * 100)
        : totalSales > 0
        ? 100
        : 0

    let totalReviews = 0

    if (professional.reviews) {
      try {
        totalReviews = professional.reviews.length
      } catch (e) {
        console.error('Error parsing reviews JSON:', e)
      }
    }

    const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => {
      const count = professional.reviews.filter((review) => review.rating).length
      return { rating, count }
    })

    const recentReviews = professional.reviews
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    const activeClients = allClients.filter((client) => client.isActive).length
    const retentionRate =
      totalClients > 0
        ? Math.round((clientsWithMultiplePurchases.length / totalClients) * 100)
        : 0

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const newClients = []

    for (let i = 0; i < 6; i++) {
      const date = new Date()
      date.setMonth(timeRanges.now.getMonth() - i)
      const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`

      const count = allClients.length

      newClients.unshift({
        period: monthYear,
        count,
      })
    }

    const monthlyRecurring = professional.ProfessionalSubscription.reduce((sum, sub) => {
      const monthlyValue =
        sub.subscriptionPlan.interval === 'year'
          ? sub.subscriptionPlan.price / 12
          : sub.subscriptionPlan.price
      return sum + monthlyValue
    }, 0)

    const averageClientValue =
      totalClients > 0 ? Math.round(totalRevenue / totalClients) : 0

    const revenueByPeriod = []
    const periodCount = 6

    // Use a more efficient approach for period calculations
    if (timeRange === 'month' || timeRange === 'week') {
      for (let i = 0; i < periodCount; i++) {
        const date = new Date()
        date.setMonth(timeRanges.now.getMonth() - i)

        const periodStart = new Date(date.getFullYear(), date.getMonth(), 1)
        const periodEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

        let periodRevenue = 0
        for (const purchase of allPurchases) {
          const purchaseDate = new Date(purchase.createdAt)
          if (purchaseDate >= periodStart && purchaseDate <= periodEnd) {
            periodRevenue += purchase.amount
          }
        }

        revenueByPeriod.unshift({
          period: `${months[date.getMonth()]} ${date.getFullYear()}`,
          revenue: periodRevenue,
        })
      }
    } else if (timeRange === 'quarter') {
      for (let i = 0; i < periodCount; i++) {
        const date = new Date()
        date.setMonth(timeRanges.now.getMonth() - i * 3)

        const quarter = Math.floor(date.getMonth() / 3) + 1
        const quarterStart = new Date(date.getFullYear(), (quarter - 1) * 3, 1)
        const quarterEnd = new Date(date.getFullYear(), quarter * 3, 0)

        let quarterRevenue = 0
        for (const purchase of allPurchases) {
          const purchaseDate = new Date(purchase.createdAt)
          if (purchaseDate >= quarterStart && purchaseDate <= quarterEnd) {
            quarterRevenue += purchase.amount
          }
        }

        revenueByPeriod.unshift({
          period: `Q${quarter} ${date.getFullYear()}`,
          revenue: quarterRevenue,
        })
      }
    } else if (timeRange === 'year') {
      for (let i = 0; i < periodCount; i++) {
        const year = timeRanges.now.getFullYear() - i
        const yearStart = new Date(year, 0, 1)
        const yearEnd = new Date(year, 11, 31)

        let yearRevenue = 0
        for (const purchase of allPurchases) {
          const purchaseDate = new Date(purchase.createdAt)
          if (purchaseDate >= yearStart && purchaseDate <= yearEnd) {
            yearRevenue += purchase.amount
          }
        }

        revenueByPeriod.unshift({
          period: year.toString(),
          revenue: yearRevenue,
        })
      }
    }

    const revenueByPlanType = []
    for (const plan of professional.plans) {
      const revenue = plan.purchases.reduce((sum, purchase) => sum + purchase.amount, 0)
      revenueByPlanType.push({
        planType: plan.name,
        revenue,
      })
    }
    revenueByPlanType.sort((a, b) => b.revenue - a.revenue)

    const conversionRate =
      allPurchaseAttempts > 0 ? Math.round((totalSales / allPurchaseAttempts) * 100) : 0
    const averageOrderValue = totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0

    const salesByPeriod = []
    for (let i = 0; i < 6; i++) {
      const date = new Date()
      date.setMonth(timeRanges.now.getMonth() - i)

      const periodStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const periodEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      let periodSales = 0
      for (const purchase of allPurchases) {
        const purchaseDate = new Date(purchase.createdAt)
        if (purchaseDate >= periodStart && purchaseDate <= periodEnd) {
          periodSales++
        }
      }

      salesByPeriod.unshift({
        period: `${months[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`,
        sales: periodSales,
      })
    }

    const salesByPlan = []
    for (const plan of professional.plans) {
      salesByPlan.push({
        plan: plan.name,
        sales: plan.purchases.length,
      })
    }
    salesByPlan.sort((a, b) => b.sales - a.sales)

    const topSellingPlans = []
    for (const plan of professional.plans) {
      const revenue = plan.purchases.reduce((sum, purchase) => sum + purchase.amount, 0)
      topSellingPlans.push({
        name: plan.name,
        count: plan.purchases.length,
        revenue,
      })
    }
    topSellingPlans.sort((a, b) => b.count - a.count)
    const limitedTopSellingPlans = topSellingPlans.slice(0, 5)

    return {
      overview: {
        totalClients,
        averageRating: professional.rating || 0,
        totalRevenue,
        totalSales,
        growthRate,
      },
      clients: {
        activeClients,
        retentionRate,
        newClients,
      },
      reviews: {
        averageRating: professional.rating,
        totalReviews,
        ratingDistribution,
        recentReviews,
      },
      financial: {
        totalRevenue,
        monthlyRecurring,
        averageClientValue,
        revenueByPeriod,
        revenueByPlanType,
      },
      sales: {
        totalSales,
        conversionRate,
        averageOrderValue,
        salesByPeriod,
        salesByPlan,
        topSellingPlans: limitedTopSellingPlans,
      },
    }
  } catch (error) {
    console.error('Error in professional metrics controller:', error)
    throw error
  }
}
