import { db } from "@/lib/db"

const DEFAULT_ROBOTS = `User-agent: *
Disallow: /dashboard/
Disallow: /api/
Allow: /

Sitemap: https://heoquaybinhtan.com/sitemap.xml`

export async function GET() {
  const config = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (config?.data ?? {}) as Record<string, string>
  const content = cfg.robotsTxtContent?.trim() || DEFAULT_ROBOTS

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
