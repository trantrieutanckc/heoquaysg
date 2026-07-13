import { db } from "@/lib/db"

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    await db.$queryRaw`SELECT 1`
    return Response.json({ ok: true, at: new Date().toISOString() })
  } catch (err) {
    console.error("[cron/ping]", err)
    return new Response("DB error", { status: 500 })
  }
}
