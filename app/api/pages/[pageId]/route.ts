import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  content: z.any().optional(),
  published: z.boolean().optional(),
})

async function getAdmin() {
  const user = await getCurrentUser()
  if (!user || (user as any).role !== "ADMIN") return null
  return user
}

export async function GET(
  _req: Request,
  { params }: { params: { pageId: string } }
) {
  const user = await getAdmin()
  if (!user) return new Response(null, { status: 403 })

  const page = await db.page.findUnique({ where: { id: params.pageId } })
  if (!page) return new Response(null, { status: 404 })
  return NextResponse.json(page)
}

export async function PATCH(
  req: Request,
  { params }: { params: { pageId: string } }
) {
  const user = await getAdmin()
  if (!user) return new Response(null, { status: 403 })

  try {
    const json = await req.json()
    const body = patchSchema.parse(json)

    if (body.slug) {
      const conflict = await db.page.findFirst({
        where: { slug: body.slug, NOT: { id: params.pageId } },
      })
      if (conflict) {
        return NextResponse.json({ error: "Slug đã tồn tại." }, { status: 409 })
      }
    }

    const page = await db.page.update({
      where: { id: params.pageId },
      data: body,
      select: { id: true, title: true, slug: true, published: true },
    })
    return NextResponse.json(page)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message }, { status: 422 })
    }
    return new Response(null, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { pageId: string } }
) {
  const user = await getAdmin()
  if (!user) return new Response(null, { status: 403 })

  try {
    await db.page.delete({ where: { id: params.pageId } })
    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 500 })
  }
}
