import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const builds = await prisma.galleryBuild.findMany({
    include: {
      variant: {
        include: {
          generation: {
            include: {
              model: {
                include: { manufacturer: true }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(builds)
}
