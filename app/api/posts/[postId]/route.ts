import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const postPatchSchema = z.object({
  title: z.string().optional(),
  content: z.any().optional(),
  published: z.boolean().optional(),
  image: z.any().optional().nullable(),
  categoryIds: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoImage: z.string().optional(),
  template: z.string().optional(),
  banner: z.any().optional().nullable(),
  relatedPostIds: z.array(z.string()).nullable().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const role = (currentUser as any).role
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
    if (post.authorId !== (currentUser as any).id) {
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
        ...(body.relatedPostIds !== undefined && { relatedPostIds: body.relatedPostIds }),
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

  const role = (currentUser as any).role
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
    if (post.authorId !== (currentUser as any).id) {
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
