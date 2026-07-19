import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { isAdmin, isEditor } from "@/lib/permissions"
import type { Role } from "@/lib/permissions"

const postCreateSchema = z.object({
  title: z.string(),
  content: z.any().optional(),
  image: z.any().optional().nullable(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const admin = isAdmin(session.user.role as Role)

    const posts = await db.post.findMany({
      select: { id: true, title: true, published: true, createdAt: true },
      where: admin ? {} : { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 200,
    })

    return new Response(JSON.stringify(posts))
  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const role = session.user.role
    if (!isEditor(role)) {
      return new Response("Forbidden", { status: 403 })
    }

    const json = await req.json()
    const body = postCreateSchema.parse(json)

    const post = await db.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: session.user.id,
        image: body.image === "" ? null : body.image,
      },
      select: { id: true },
    })

    return new Response(JSON.stringify(post))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }
    return new Response(null, { status: 500 })
  }
}
