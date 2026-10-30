import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const manufacturerId = searchParams.get('manufacturerId')
  const modelId = searchParams.get('modelId')
  const generationId = searchParams.get('generationId')
  const variantId = searchParams.get('variantId')

  if (variantId) {
    const variant = await prisma.vehicleVariant.findUnique({
      where: { id: variantId },
      include: {
        generation: {
          include: {
            model: {
              include: { manufacturer: true }
            }
          }
        },
        fitments: true
      }
    })
    return NextResponse.json(variant)
  }

  if (generationId) {
    const variants = await prisma.vehicleVariant.findMany({
      where: { generationId }
    })
    return NextResponse.json(variants)
  }

  if (modelId) {
    const generations = await prisma.vehicleGeneration.findMany({
      where: { modelId },
      include: { variants: true }
    })
    return NextResponse.json(generations)
  }

  if (manufacturerId) {
    const models = await prisma.vehicleModel.findMany({
      where: { manufacturerId },
      include: { generations: { include: { variants: true } } }
    })
    return NextResponse.json(models)
  }

  const manufacturers = await prisma.vehicleManufacturer.findMany({
    include: {
      models: {
        include: {
          generations: {
            include: { variants: true }
          }
        }
      }
    }
  })
  return NextResponse.json(manufacturers)
}
