import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function GET() {
  const tags = await db.tag.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, _count: { select: { posts: true } } },
  })
  return NextResponse.json(tags)
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return new Response(null, { status: 403 })
  }

  const json = await req.json()
  const body = z.object({ name: z.string().min(1) }).parse(json)
  const slug = slugify(body.name)

  const tag = await db.tag.create({ data: { name: body.name, slug } })
  return NextResponse.json(tag, { status: 201 })
}
