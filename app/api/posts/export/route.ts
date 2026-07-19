import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { isAdmin } from "@/lib/permissions"
import type { Role } from "@/lib/permissions"

function esc(v: string) {
  return `"${v.replace(/"/g, '""')}"`
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return new Response("Unauthorized", { status: 403 })

  const admin = isAdmin(session.user.role as Role)

  const posts = await db.post.findMany({
    where: admin ? {} : { authorId: session.user.id },
    select: {
      id: true,
      title: true,
      published: true,
      featured: true,
      price: true,
      likes: true,
      createdAt: true,
      categories: { select: { category: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  })

  const header = "id,title,published,featured,price,categories,likes,createdAt"
  const rows = posts.map((p) => [
    esc(p.id),
    esc(p.title),
    p.published ? "true" : "false",
    p.featured ? "true" : "false",
    p.price ?? "",
    esc(p.categories.map((c) => c.category.name).join("|")),
    p.likes,
    p.createdAt.toISOString(),
  ].join(","))

  const csv = [header, ...rows].join("\n")
  const date = new Date().toISOString().slice(0, 10)

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="posts-${date}.csv"`,
    },
  })
}
