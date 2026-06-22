import { NextResponse } from "next/server"
import * as z from "zod"

import { db } from "@/lib/db"

const imageSchema = z.object({
  url: z.string().optional().or(z.literal("")),
  alt: z.string().optional(),
  title: z.string().optional(),
}).optional().nullable()

const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
  image: imageSchema,
})

export async function GET() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  })
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = createCategorySchema.parse(json)

    const category = await db.category.create({
      data: { name: body.name, slug: body.slug, image: body.image ?? undefined },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }
    return new Response(null, { status: 500 })
  }
}
