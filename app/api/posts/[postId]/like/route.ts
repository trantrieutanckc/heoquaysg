import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { action } = await req.json()
    if (action !== "like" && action !== "unlike") {
      return new Response("Invalid action", { status: 400 })
    }

    const post = await db.post.update({
      where: { id: params.postId },
      data: {
        likes: action === "like" ? { increment: 1 } : { decrement: 1 },
      },
      select: { likes: true },
    })

    return NextResponse.json({ likes: Math.max(0, post.likes) })
  } catch {
    return new Response(null, { status: 500 })
  }
}
