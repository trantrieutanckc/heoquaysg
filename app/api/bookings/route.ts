import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"

const RATE_LIMIT_MINUTES = 10
const MIN_FORM_SECONDS = 5

const itemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  quantity: z.number().int().positive().max(50),
})

const bookingSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(9).max(15),
  address: z.string().max(300).optional(),
  items: z.array(itemSchema).min(1, "Vui lòng chọn ít nhất 1 món."),
  deliveryDate: z.string().min(1),
  note: z.string().max(500).optional(),
  _formLoadedAt: z.number().optional(),
})

export async function POST(req: Request) {
  try {
    const body = bookingSchema.parse(await req.json())

    // Chống bot: form phải được điền ít nhất 5 giây
    if (body._formLoadedAt) {
      const elapsed = (Date.now() - body._formLoadedAt) / 1000
      if (elapsed < MIN_FORM_SECONDS) {
        return NextResponse.json({ error: "Vui lòng điền form cẩn thận hơn." }, { status: 429 })
      }
    }

    // Rate limit: cùng SĐT chỉ đặt 1 lần mỗi 10 phút
    const since = new Date(Date.now() - RATE_LIMIT_MINUTES * 60 * 1000)
    const recent = await db.booking.findFirst({
      where: { phone: body.phone, createdAt: { gte: since } },
      select: { id: true },
    })
    if (recent) {
      return NextResponse.json(
        { error: `Số điện thoại này vừa đặt đơn. Vui lòng chờ ${RATE_LIMIT_MINUTES} phút trước khi đặt lại.` },
        { status: 429 }
      )
    }

    const booking = await db.booking.create({
      data: {
        name: body.name,
        phone: body.phone,
        address: body.address,
        items: body.items,
        deliveryDate: new Date(body.deliveryDate),
        note: body.note,
        status: "pending",
      },
    })
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 422 })
    }
    console.error("[bookings POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
