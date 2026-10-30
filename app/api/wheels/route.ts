import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const brandId = searchParams.get('brandId')
  const diameter = searchParams.get('diameter')
  const width = searchParams.get('width')
  const boltPattern = searchParams.get('boltPattern')
  const finish = searchParams.get('finish')
  const search = searchParams.get('search')

  const wheels = await prisma.wheel.findMany({
    where: {
      AND: [
        brandId ? { brandId } : {},
        search ? {
          OR: [
            { modelName: { contains: search } },
            { brand: { name: { contains: search } } }
          ]
        } : {}
      ]
    },
    include: {
      brand: true,
      variants: {
        where: {
          AND: [
            diameter ? { diameter: parseFloat(diameter) } : {},
            width ? { width: parseFloat(width) } : {},
            boltPattern ? { boltPattern: { contains: boltPattern } } : {},
            finish ? { finish: { contains: finish } } : {}
          ]
        }
      }
    }
  })

  // Filter out wheels that have 0 variants matching the variant filters if variant filters were applied
  const filtered = wheels.filter(w => w.variants.length > 0)

  return NextResponse.json(filtered)
}
