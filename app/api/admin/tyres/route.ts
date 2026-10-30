import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all tyres with brands and variants
export async function GET() {
  try {
    const tyres = await prisma.tyre.findMany({
      include: { brand: true, variants: true },
      orderBy: { modelName: 'asc' }
    })
    const brands = await prisma.tyreBrand.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json({ tyres, brands })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tyres' }, { status: 500 })
  }
}

// POST - Create tyre brand or tyre
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'brand') {
      const brand = await prisma.tyreBrand.create({
        data: { name: data.name, logoUrl: data.logoUrl || null }
      })
      return NextResponse.json(brand)
    }

    if (type === 'tyre') {
      const tyre = await prisma.tyre.create({
        data: {
          brandId: data.brandId,
          modelName: data.modelName,
          description: data.description || null,
          category: data.category,
          season: data.season,
          imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
        },
        include: { brand: true }
      })
      return NextResponse.json(tyre)
    }

    if (type === 'variant') {
      const variant = await prisma.tyreVariant.create({
        data: {
          tyreId: data.tyreId,
          width: parseInt(data.width),
          aspectRatio: parseInt(data.aspectRatio),
          rimDiameter: parseFloat(data.rimDiameter),
          loadIndex: parseInt(data.loadIndex),
          speedRating: data.speedRating,
          wetGrip: data.wetGrip,
          dryPerformance: parseFloat(data.dryPerformance),
          comfortRating: parseFloat(data.comfortRating),
          treadwear: parseInt(data.treadwear),
          price: parseFloat(data.price),
          stockQty: parseInt(data.stockQty),
          sku: data.sku,
        }
      })
      return NextResponse.json(variant)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create' }, { status: 500 })
  }
}

// DELETE tyre or brand
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!id || !type) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

    if (type === 'tyre') {
      await prisma.tyre.delete({ where: { id } })
    } else if (type === 'brand') {
      await prisma.tyreBrand.delete({ where: { id } })
    } else if (type === 'variant') {
      await prisma.tyreVariant.delete({ where: { id } })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete' }, { status: 500 })
  }
}

// PATCH - Update tyre stock or price
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { type, id, data } = body

    if (type === 'tyreVariant') {
      const variant = await prisma.tyreVariant.update({
        where: { id },
        data: {
          price: data.price !== undefined ? parseFloat(data.price) : undefined,
          stockQty: data.stockQty !== undefined ? parseInt(data.stockQty) : undefined,
        }
      })
      return NextResponse.json(variant)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update' }, { status: 500 })
  }
}
