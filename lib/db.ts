import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient
}

function patchDatabaseUrl() {
  if (!process.env.DATABASE_URL) return
  let url = process.env.DATABASE_URL
  // Override any connection_limit=1 set in Supabase pooler URL
  url = url.replace(/connection_limit=\d+/g, "connection_limit=5")
  url = url.replace(/pool_timeout=\d+/g, "pool_timeout=20")
  if (!url.includes("connection_limit=")) {
    url += (url.includes("?") ? "&" : "?") + "connection_limit=5"
  }
  if (!url.includes("pool_timeout=")) {
    url += "&pool_timeout=20"
  }
  process.env.DATABASE_URL = url
}

let prisma: PrismaClient
if (!global.cachedPrisma) {
  patchDatabaseUrl()
  global.cachedPrisma = new PrismaClient()
}
prisma = global.cachedPrisma

export const db = prisma
