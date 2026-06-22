import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"

const commentSchema = z.object({
  content: z.string().min(1).max(2000),
  authorName: z.string().min(1).max(100),
  authorEmail: z.string().email().optional().or(z.literal("")),
})

export async function GET(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  const comments = await db.comment.findMany({
    where: { postId: params.postId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      authorName: true,
      createdAt: true,
    },
  })
  return NextResponse.json(comments)
}

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const json = await req.json()
    const body = commentSchema.parse(json)

    const post = await db.post.findUnique({ where: { id: params.postId }, select: { id: true } })
    if (!post) return new Response("Not found", { status: 404 })

    const comment = await db.comment.create({
      data: {
        content: body.content,
        authorName: body.authorName,
        authorEmail: body.authorEmail || undefined,
        postId: params.postId,
      },
      select: {
        id: true,
        content: true,
        authorName: true,
        createdAt: true,
      },
    })
    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }
    return new Response(null, { status: 500 })
  }
}
