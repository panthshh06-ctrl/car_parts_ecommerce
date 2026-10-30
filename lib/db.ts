import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  })

// Enable SQLite WAL mode for high concurrency without locks
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

prisma.$executeRawUnsafe('PRAGMA journal_mode = WAL;').catch(() => {})
prisma.$executeRawUnsafe('PRAGMA busy_timeout = 5000;').catch(() => {})
