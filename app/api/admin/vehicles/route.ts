import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all vehicles (manufacturers with full hierarchy)
export async function GET() {
  try {
    const manufacturers = await prisma.vehicleManufacturer.findMany({
      include: {
        models: {
          include: {
            generations: {
              include: { variants: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(manufacturers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 })
  }
}

// POST - Create a new manufacturer
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'manufacturer') {
      const manufacturer = await prisma.vehicleManufacturer.create({
        data: {
          name: data.name,
          country: data.country || null,
          logoUrl: data.logoUrl || null,
        }
      })
      return NextResponse.json(manufacturer)
    }

    if (type === 'model') {
      const model = await prisma.vehicleModel.create({
        data: {
          name: data.name,
          manufacturerId: data.manufacturerId,
        }
      })
      return NextResponse.json(model)
    }

    if (type === 'generation') {
      const generation = await prisma.vehicleGeneration.create({
        data: {
          name: data.name,
          modelId: data.modelId,
          startYear: parseInt(data.startYear),
          endYear: data.endYear ? parseInt(data.endYear) : null,
        }
      })
      return NextResponse.json(generation)
    }

    if (type === 'variant') {
      const variant = await prisma.vehicleVariant.create({
        data: {
          name: data.name,
          generationId: data.generationId,
          bodyType: data.bodyType,
          driveType: data.driveType,
          engine: data.engine,
          oemWheelDiam: parseFloat(data.oemWheelDiam),
          oemWheelWidth: parseFloat(data.oemWheelWidth),
          oemTyreSize: data.oemTyreSize,
          boltPattern: data.boltPattern,
          centreBore: parseFloat(data.centreBore),
          oemOffset: parseInt(data.oemOffset),
          minOffset: parseInt(data.minOffset),
          maxOffset: parseInt(data.maxOffset),
          minWidth: parseFloat(data.minWidth),
          maxWidth: parseFloat(data.maxWidth),
        }
      })
      return NextResponse.json(variant)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create vehicle entry' }, { status: 500 })
  }
}

// DELETE - Remove a manufacturer/model/generation/variant
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!id || !type) return NextResponse.json({ error: 'Missing id or type' }, { status: 400 })

    if (type === 'manufacturer') {
      await prisma.vehicleManufacturer.delete({ where: { id } })
    } else if (type === 'model') {
      await prisma.vehicleModel.delete({ where: { id } })
    } else if (type === 'generation') {
      await prisma.vehicleGeneration.delete({ where: { id } })
    } else if (type === 'variant') {
      await prisma.vehicleVariant.delete({ where: { id } })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete' }, { status: 500 })
  }
}
