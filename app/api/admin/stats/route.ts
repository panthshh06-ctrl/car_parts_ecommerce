import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [
      totalOrders,
      totalWheels,
      totalTyres,
      totalVehicleVariants,
      totalManufacturers,
      recentOrders,
      lowStockWheels,
      lowStockTyres,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.wheel.count(),
      prisma.tyre.count(),
      prisma.vehicleVariant.count(),
      prisma.vehicleManufacturer.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
        }
      }),
      prisma.wheelVariant.findMany({
        where: { stockQty: { lt: 5 } },
        include: { wheel: { include: { brand: true } } },
        take: 5
      }),
      prisma.tyreVariant.findMany({
        where: { stockQty: { lt: 5 } },
        include: { tyre: { include: { brand: true } } },
        take: 5
      }),
    ])

    // Revenue calculation
    const ordersWithAmounts = await prisma.order.findMany({
      select: { totalAmount: true, status: true }
    })
    const totalRevenue = ordersWithAmounts.reduce((sum, o) => sum + o.totalAmount, 0)
    const pendingOrders = ordersWithAmounts.filter(o => o.status === 'PENDING').length

    return NextResponse.json({
      stats: {
        totalOrders,
        totalWheels,
        totalTyres,
        totalVehicleVariants,
        totalManufacturers,
        totalRevenue,
        pendingOrders,
      },
      recentOrders,
      lowStockWheels,
      lowStockTyres,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch stats' }, { status: 500 })
  }
}
