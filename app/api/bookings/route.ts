import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"

const bookingSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(9).max(15),
  address: z.string().max(300).optional(),
  product: z.enum(["heo-quay", "ga-quay", "vit-quay", "heo-quay-sua"]),
  quantity: z.number().positive().max(100),
  deliveryDate: z.string().min(1),
  note: z.string().max(500).optional(),
})

export async function POST(req: Request) {
  try {
    const body = bookingSchema.parse(await req.json())
    const booking = await db.booking.create({
      data: {
        name: body.name,
        phone: body.phone,
        address: body.address,
        product: body.product,
        quantity: body.quantity,
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
