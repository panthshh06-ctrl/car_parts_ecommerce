import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all orders with full details
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: {
            wheelVariant: { include: { wheel: { include: { brand: true } } } },
            tyreVariant: { include: { tyre: { include: { brand: true } } } },
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// PATCH - Update order status
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, trackingNumber } = body

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: status || undefined,
        trackingNumber: trackingNumber || undefined,
      }
    })
    return NextResponse.json(order)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 })
  }
}
