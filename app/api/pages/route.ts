import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const createSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
})

export async function GET() {
  const user = await getCurrentUser()
  if (!user || (user as any).role !== "ADMIN") {
    return new Response(null, { status: 403 })
  }

  const pages = await db.page.findMany({
    select: { id: true, title: true, slug: true, published: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  })
  return NextResponse.json(pages)
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || (user as any).role !== "ADMIN") {
    return new Response(null, { status: 403 })
  }

  try {
    const json = await req.json()
    const body = createSchema.parse(json)

    const existing = await db.page.findUnique({ where: { slug: body.slug } })
    if (existing) {
      return NextResponse.json({ error: "Slug đã tồn tại." }, { status: 409 })
    }

    const page = await db.page.create({
      data: { title: body.title, slug: body.slug },
      select: { id: true },
    })
    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message }, { status: 422 })
    }
    return new Response(null, { status: 500 })
  }
}
