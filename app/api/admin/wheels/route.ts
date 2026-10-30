import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all wheels with brands and variants
export async function GET() {
  try {
    const wheels = await prisma.wheel.findMany({
      include: { brand: true, variants: true },
      orderBy: { modelName: 'asc' }
    })
    const brands = await prisma.wheelBrand.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json({ wheels, brands })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wheels' }, { status: 500 })
  }
}

// POST - Create wheel brand or wheel
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'brand') {
      const brand = await prisma.wheelBrand.create({
        data: { name: data.name, logoUrl: data.logoUrl || null }
      })
      return NextResponse.json(brand)
    }

    if (type === 'wheel') {
      const wheel = await prisma.wheel.create({
        data: {
          brandId: data.brandId,
          modelName: data.modelName,
          description: data.description || null,
          construction: data.construction,
          material: data.material,
          imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
          galleryImages: data.galleryImages || '[]',
        },
        include: { brand: true }
      })
      return NextResponse.json(wheel)
    }

    if (type === 'variant') {
      const variant = await prisma.wheelVariant.create({
        data: {
          wheelId: data.wheelId,
          diameter: parseFloat(data.diameter),
          width: parseFloat(data.width),
          offset: parseInt(data.offset),
          boltPattern: data.boltPattern,
          centreBore: parseFloat(data.centreBore),
          finish: data.finish,
          color: data.color,
          weightKg: parseFloat(data.weightKg),
          loadRatingKg: parseInt(data.loadRatingKg),
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

// DELETE wheel or brand
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!id || !type) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

    if (type === 'wheel') {
      await prisma.wheel.delete({ where: { id } })
    } else if (type === 'brand') {
      await prisma.wheelBrand.delete({ where: { id } })
    } else if (type === 'variant') {
      await prisma.wheelVariant.delete({ where: { id } })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete' }, { status: 500 })
  }
}

// PATCH - Update wheel stock or price
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { type, id, data } = body

    if (type === 'wheelVariant') {
      const variant = await prisma.wheelVariant.update({
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
