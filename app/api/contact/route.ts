import { NextResponse } from "next/server"
import * as z from "zod"
import { sendContactEmail } from "@/lib/mailer"
import { checkRateLimit } from "@/lib/rate-limit"

const contactSchema = z.object({
  name: z.string().min(1, "Tên không được để trống").max(100),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  message: z.string().min(1, "Nội dung không được để trống").max(2000),
})

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  if (!checkRateLimit(`contact:${ip}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Quá nhiều yêu cầu. Vui lòng thử lại sau." }, { status: 429 })
  }

  try {
    const json = await req.json()
    const body = contactSchema.parse(json)

    sendContactEmail({
      name: body.name,
      email: body.email || undefined,
      phone: body.phone || undefined,
      message: body.message,
    }).catch(() => {})

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
