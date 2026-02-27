import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const createPrismaClient = () => {
  // 1. Create a Postgres Pool
  const pool = new Pool({ connectionString })
  // 2. Create the Adapter
  const adapter = new PrismaPg(pool)
  // 3. Pass the adapter to PrismaClient
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma