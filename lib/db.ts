import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient
}

function createPrismaClient() {
  const url = new URL(process.env.DATABASE_URL!)
  url.searchParams.set("connection_limit", "5")
  url.searchParams.set("pool_timeout", "20")
  return new PrismaClient({ datasources: { db: { url: url.toString() } } })
}

let prisma: PrismaClient
if (!global.cachedPrisma) {
  global.cachedPrisma = createPrismaClient()
}
prisma = global.cachedPrisma

export const db = prisma
