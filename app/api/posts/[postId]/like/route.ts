import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  if (!checkRateLimit(`like:${ip}:${params.postId}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

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
