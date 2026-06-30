import { NextResponse } from "next/server"
import * as z from "zod"
import { Prisma } from "@prisma/client"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const postPatchSchema = z.object({
  title: z.string().optional(),
  content: z.any().optional(),
  published: z.boolean().optional(),
  image: z.any().optional().nullable(),
  categoryIds: z.array(z.string()).optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  seoKeywords: z.string().nullable().optional(),
  seoImage: z.string().nullable().optional(),
  template: z.string().optional(),
  banner: z.any().optional().nullable(),
  relatedPostIds: z.array(z.string()).nullable().optional(),
  price: z.number().nullable().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
  bookable: z.boolean().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const role = currentUser.role
  if (role !== "ADMIN" && role !== "EDITOR") {
    return new Response(null, { status: 403 })
  }

  // EDITOR chỉ được sửa bài của chính mình
  if (role === "EDITOR") {
    const post = await db.post.findUnique({
      where: { id: params.postId },
      select: { authorId: true },
    })
    if (!post) return new Response(null, { status: 404 })
    if (post.authorId !== currentUser.id) {
      return new Response(null, { status: 403 })
    }
  }

  try {
    const json = await req.json()
    const body = postPatchSchema.parse(json)

    await db.post.update({
      where: { id: params.postId },
      data: {
        title: body.title,
        content: body.content,
        ...(body.published !== undefined && { published: body.published }),
        image: body.image == null || body.image === "" ? undefined : body.image,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        seoKeywords: body.seoKeywords,
        seoImage: body.seoImage,
        template: body.template,
        ...(body.banner !== undefined && { banner: body.banner ?? undefined }),
        ...(body.relatedPostIds !== undefined && { relatedPostIds: body.relatedPostIds === null ? Prisma.JsonNull : body.relatedPostIds }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.bookable !== undefined && { bookable: body.bookable }),
        ...(body.scheduledAt !== undefined && {
          scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        }),
        // Khi publish thủ công thì xoá lịch đã đặt
        ...(body.published !== undefined && { scheduledAt: null }),
        ...(body.categoryIds !== undefined && {
          categories: {
            deleteMany: {},
            create: body.categoryIds.map((id) => ({ categoryId: id })),
          },
        }),
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }
    console.error("[posts PATCH]", error)
    return new Response(null, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const role = currentUser.role
  if (role !== "ADMIN" && role !== "EDITOR") {
    return new Response(null, { status: 403 })
  }

  // EDITOR chỉ được xóa bài của chính mình
  if (role === "EDITOR") {
    const post = await db.post.findUnique({
      where: { id: params.postId },
      select: { authorId: true },
    })
    if (!post) return new Response(null, { status: 404 })
    if (post.authorId !== currentUser.id) {
      return new Response(null, { status: 403 })
    }
  }

  try {
    await db.post.delete({ where: { id: params.postId } })
    return new Response(null, { status: 200 })
  } catch {
    return new Response(null, { status: 500 })
  }
}
