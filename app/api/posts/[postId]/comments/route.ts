import { NextRequest, NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"
import { sendCommentNotification } from "@/lib/mailer"
import { createCommentNotification } from "@/lib/notifications"

// ── Rate limiter: 5 comments per IP per hour ──────────────────────────────────
const commentRateMap = new Map<string, { count: number; resetAt: number }>()
const COMMENT_LIMIT = 5
const COMMENT_WINDOW = 60 * 60 * 1000 // 1 hour

function checkCommentRate(ip: string): boolean {
  const now = Date.now()
  const entry = commentRateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    commentRateMap.set(ip, { count: 1, resetAt: now + COMMENT_WINDOW })
    return true
  }
  if (entry.count >= COMMENT_LIMIT) return false
  entry.count++
  return true
}

// ── Spam detection ────────────────────────────────────────────────────────────
// Blocks URLs (the #1 spam signal), shortlink domains, and common spam keywords
const URL_RE = /https?:\/\/\S+|www\.\S+/i
const SHORTLINK_RE = /\b(shorturl\.|bit\.ly|tinyurl\.|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|adf\.ly|linktr\.ee)\S*/i
const SPAM_KEYWORDS = /\b(casino|poker|viagra|cialis|lottery|winner|prize|free money|make money|earn \$|click here|buy now|order now|discount code|promo code)\b/i
// Bot names often follow: Name + 3-4 digit number (e.g. Hailey3066, Cynthia2354)
const BOT_NAME_RE = /^[A-Za-z]{3,15}\d{3,5}$/

function isSpam(text: string, name?: string): boolean {
  if (URL_RE.test(text) || SHORTLINK_RE.test(text)) return true
  if (SPAM_KEYWORDS.test(text)) return true
  if (name && BOT_NAME_RE.test(name.trim())) return true
  return false
}

// ── Strip HTML tags (comments are plain text only) ────────────────────────────
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim()
}

// ── Zod schema ────────────────────────────────────────────────────────────────
const commentSchema = z.object({
  content: z.string().min(5, "Bình luận quá ngắn").max(2000, "Bình luận tối đa 2000 ký tự"),
  authorName: z.string().min(1).max(100),
  authorEmail: z.string().email().optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5).optional(),
  _hp: z.string().optional(), // honeypot — must be empty
})

// ── GET: only approved comments ───────────────────────────────────────────────
export async function GET(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  const comments = await db.comment.findMany({
    where: { postId: params.postId, approved: true },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      authorName: true,
      rating: true,
      createdAt: true,
    },
  })
  return NextResponse.json(comments)
}

// ── POST: create comment (pending moderation) ─────────────────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  // Rate limit
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"

  if (!checkCommentRate(ip)) {
    return NextResponse.json(
      { error: "Bạn đã gửi quá nhiều bình luận. Vui lòng thử lại sau 1 giờ." },
      { status: 429 }
    )
  }

  try {
    const json = await req.json()
    const body = commentSchema.parse(json)

    // Honeypot: bots fill hidden fields, humans don't
    if (body._hp) {
      return NextResponse.json({ pending: true }, { status: 202 }) // silently discard
    }

    // Strip any HTML tags from content
    const cleanContent = stripHtml(body.content)
    const cleanName = stripHtml(body.authorName)

    // Spam check on cleaned content + name pattern
    if (isSpam(cleanContent, cleanName)) {
      return NextResponse.json(
        { error: "Bình luận bị phát hiện là spam." },
        { status: 422 }
      )
    }

    const post = await db.post.findUnique({
      where: { id: params.postId },
      select: { id: true, title: true },
    })
    if (!post) return new Response("Not found", { status: 404 })

    await db.comment.create({
      data: {
        content: cleanContent,
        authorName: cleanName,
        authorEmail: body.authorEmail || undefined,
        postId: params.postId,
        rating: body.rating ?? null,
        approved: false, // requires admin moderation
      },
    })

    // Fire-and-forget: email + in-app notifications
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? ""
    sendCommentNotification({
      postId: params.postId,
      postTitle: post.title,
      authorName: cleanName,
      authorEmail: body.authorEmail || null,
      content: cleanContent,
      siteUrl,
    })

    createCommentNotification({
      postId: params.postId,
      postTitle: post.title,
      authorName: cleanName,
    }).catch(() => {}) // fire-and-forget

    // Return 202 Accepted — comment is pending, not yet visible
    return NextResponse.json({ pending: true }, { status: 202 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
        { status: 422 }
      )
    }
    return new Response(null, { status: 500 })
  }
}
