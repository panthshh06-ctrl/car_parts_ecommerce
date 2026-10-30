import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const brandId = searchParams.get('brandId')
  const category = searchParams.get('category')
  const season = searchParams.get('season')
  const width = searchParams.get('width')
  const rimDiameter = searchParams.get('rimDiameter')
  const search = searchParams.get('search')

  const tyres = await prisma.tyre.findMany({
    where: {
      AND: [
        brandId ? { brandId } : {},
        category ? { category } : {},
        season ? { season } : {},
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
            width ? { width: parseInt(width) } : {},
            rimDiameter ? { rimDiameter: parseFloat(rimDiameter) } : {}
          ]
        }
      }
    }
  })

  const filtered = tyres.filter(t => t.variants.length > 0)

  return NextResponse.json(filtered)
}
