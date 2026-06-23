import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient
}

function createPrismaClient() {
  if (process.env.NODE_ENV !== "production") {
    // Giới hạn connection pool trong dev để tránh hết slot trên Supabase free tier
    const url = new URL(process.env.DATABASE_URL!)
    url.searchParams.set("connection_limit", "2")
    url.searchParams.set("pool_timeout", "10")
    return new PrismaClient({ datasources: { db: { url: url.toString() } } })
  }
  return new PrismaClient()
}

let prisma: PrismaClient
if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient()
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = createPrismaClient()
  }
  prisma = global.cachedPrisma
}

export const db = prisma
