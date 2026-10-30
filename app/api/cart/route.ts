import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'enthusiast@car.com' // demo fallback user

  const user = await prisma.user.findUnique({ where: { email: userId } })
  if (!user) return NextResponse.json([])

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: {
      wheelVariant: { include: { wheel: { include: { brand: true } } } },
      tyreVariant: { include: { tyre: { include: { brand: true } } } }
    }
  })
  return NextResponse.json(cartItems)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId = 'enthusiast@car.com', type, wheelVariantId, tyreVariantId, quantity = 1, mountedBalanced = true } = body

    let user = await prisma.user.findUnique({ where: { email: userId } })
    if (!user) {
      user = await prisma.user.create({ data: { email: userId, name: 'Alex Mercer' } })
    }

    const item = await prisma.cartItem.create({
      data: {
        userId: user.id,
        type,
        wheelVariantId: wheelVariantId || null,
        tyreVariantId: tyreVariantId || null,
        quantity,
        mountedBalanced
      },
      include: {
        wheelVariant: { include: { wheel: { include: { brand: true } } } },
        tyreVariant: { include: { tyre: { include: { brand: true } } } }
      }
    })

    return NextResponse.json(item)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing cart item ID' }, { status: 400 })

  await prisma.cartItem.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
