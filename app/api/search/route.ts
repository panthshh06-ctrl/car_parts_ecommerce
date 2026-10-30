import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''

  if (!q.trim()) {
    return NextResponse.json({ wheels: [], tyres: [], vehicles: [], gallery: [] })
  }

  const wheels = await prisma.wheel.findMany({
    where: {
      OR: [
        { modelName: { contains: q } },
        { brand: { name: { contains: q } } }
      ]
    },
    include: { brand: true, variants: true },
    take: 5
  })

  const tyres = await prisma.tyre.findMany({
    where: {
      OR: [
        { modelName: { contains: q } },
        { brand: { name: { contains: q } } },
        { category: { contains: q } }
      ]
    },
    include: { brand: true, variants: true },
    take: 5
  })

  const variants = await prisma.vehicleVariant.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { engine: { contains: q } },
        { generation: { model: { name: { contains: q } } } }
      ]
    },
    include: {
      generation: {
        include: {
          model: {
            include: { manufacturer: true }
          }
        }
      }
    },
    take: 5
  })

  const gallery = await prisma.galleryBuild.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { carDetails: { contains: q } }
      ]
    },
    take: 4
  })

  return NextResponse.json({ wheels, tyres, vehicles: variants, gallery })
}
