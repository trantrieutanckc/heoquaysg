import { db } from "./db"

export async function isIpBlocked(ip: string): Promise<boolean> {
  if (!ip || ip === "unknown") return false
  const blocked = await db.blockedIp.findUnique({ where: { ip } })
  return !!blocked
}

export async function logRequest(ip: string, path: string) {
  if (!ip || ip === "unknown") return
  await db.requestLog.upsert({
    where: { ip_path: { ip, path } },
    update: { count: { increment: 1 }, lastSeen: new Date() },
    create: { ip, path },
  }).catch(() => null)
}
