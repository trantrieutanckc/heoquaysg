import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const createMenuItemSchema = z.object({
  title: z.string().min(1).max(50),
  href: z.string().min(1),
  type: z.enum(["custom", "category", "page"]).optional(),
  order: z.number().optional(),
  disabled: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
})

export async function GET() {
  const items = await db.menuItem.findMany({
    orderBy: { order: "asc" },
    include: { category: { select: { id: true, name: true, slug: true } } },
  })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const json = await req.json()
    const body = createMenuItemSchema.parse(json)

    const item = await db.menuItem.create({
      data: {
        title: body.title,
        href: body.href,
        type: body.type ?? "custom",
        order: body.order ?? 0,
        disabled: body.disabled ?? false,
        categoryId: body.categoryId ?? undefined,
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }
    return new Response(null, { status: 500 })
  }
}
