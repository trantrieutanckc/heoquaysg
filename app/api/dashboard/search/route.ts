import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.trim() ?? ""

  if (!q) return NextResponse.json([])

  const [posts, categories, users] = await Promise.all([
    db.post.findMany({
      where: { title: { contains: q, mode: "insensitive" } },
      select: { id: true, title: true, published: true },
      take: 5,
      orderBy: { updatedAt: "desc" },
    }),
    db.category.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      select: { id: true, name: true, slug: true },
      take: 3,
    }),
    db.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, email: true },
      take: 3,
    }),
  ])

  const results = [
    ...posts.map((p) => ({
      id: p.id,
      title: p.title || "Untitled",
      subtitle: p.published ? "Đã xuất bản" : "Bản nháp",
      href: `/editor/${p.id}`,
      type: "post" as const,
    })),
    ...categories.map((c) => ({
      id: c.id,
      title: c.name,
      subtitle: `/categories/${c.slug}`,
      href: `/dashboard/categories`,
      type: "category" as const,
    })),
    ...users.map((u) => ({
      id: u.id,
      title: u.name ?? "—",
      subtitle: u.email ?? "",
      href: `/dashboard/users`,
      type: "user" as const,
    })),
  ]

  return NextResponse.json(results)
}
