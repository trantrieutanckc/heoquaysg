import { NextResponse } from "next/server"
import * as z from "zod"

const contactSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  message: z.string().min(1, "Nội dung không được để trống"),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = contactSchema.parse(json)

    console.log("[contact] New message:", body)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 422 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
