import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { variantId, wheelVariantId, tyreVariantId } = body

    if (!variantId || !wheelVariantId) {
      return NextResponse.json({ error: 'Missing vehicle variant or wheel specification' }, { status: 400 })
    }

    const vehicleVariant = await prisma.vehicleVariant.findUnique({
      where: { id: variantId },
      include: { fitments: true }
    })

    const wheelVariant = await prisma.wheelVariant.findUnique({
      where: { id: wheelVariantId },
      include: { wheel: { include: { brand: true } } }
    })

    let tyreVariant = null
    if (tyreVariantId) {
      tyreVariant = await prisma.tyreVariant.findUnique({
        where: { id: tyreVariantId },
        include: { tyre: { include: { brand: true } } }
      })
    }

    if (!vehicleVariant || !wheelVariant) {
      return NextResponse.json({ error: 'Vehicle or wheel variant not found' }, { status: 404 })
    }

    // Fitment validation logic
    let status = 'DIRECT_FIT'
    const reasons: string[] = []

    // 1. Check Bolt Pattern (PCD)
    if (wheelVariant.boltPattern !== vehicleVariant.boltPattern) {
      status = 'NOT_COMPATIBLE'
      reasons.push(`Bolt pattern mismatch: Wheel is ${wheelVariant.boltPattern}, vehicle requires ${vehicleVariant.boltPattern}.`)
    }

    // 2. Check Centre Bore
    if (wheelVariant.centreBore < vehicleVariant.centreBore) {
      status = 'NOT_COMPATIBLE'
      reasons.push(`Centre bore too small: Wheel CB is ${wheelVariant.centreBore}mm, vehicle requires at least ${vehicleVariant.centreBore}mm (hubcentric rings required if larger).`)
    } else if (wheelVariant.centreBore > vehicleVariant.centreBore) {
      reasons.push(`Hubcentric ring required (Wheel CB ${wheelVariant.centreBore}mm > Vehicle CB ${vehicleVariant.centreBore}mm).`)
    }

    // 3. Check Width & Offset range
    if (wheelVariant.width < vehicleVariant.minWidth || wheelVariant.width > vehicleVariant.maxWidth) {
      if (status !== 'NOT_COMPATIBLE') status = 'MODIFIED_FIT'
      reasons.push(`Wheel width (${wheelVariant.width}") is outside standard OEM range (${vehicleVariant.minWidth}" - ${vehicleVariant.maxWidth}"). Fender rolling or negative camber may be required.`)
    }

    if (wheelVariant.offset < vehicleVariant.minOffset || wheelVariant.offset > vehicleVariant.maxOffset) {
      if (status !== 'NOT_COMPATIBLE') status = 'MODIFIED_FIT'
      reasons.push(`Wheel offset (+${wheelVariant.offset}) is outside recommended range (+${vehicleVariant.minOffset} to +${vehicleVariant.maxOffset}). May cause inner rubbing or aggressive poke.`)
    }

    return NextResponse.json({
      status,
      reasons,
      vehicle: vehicleVariant,
      wheel: wheelVariant,
      tyre: tyreVariant,
      disclaimer: 'Final fitment should be professionally verified prior to permanent mounting.'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
