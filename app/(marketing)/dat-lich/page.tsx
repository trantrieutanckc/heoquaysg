import { db } from "@/lib/db"
import { BookingForm } from "./booking-form"

export const metadata = {
  title: "Đặt lịch giao hàng",
  description: "Đặt heo quay, gà quay, vịt quay — giao tận nơi đúng giờ tại Heo Quay Bình Tân.",
}

export default async function DatLichPage() {
  const products = await db.post.findMany({
    where: { bookable: true, published: true },
    select: { id: true, title: true, price: true },
    orderBy: { createdAt: "asc" },
  })

  return (
    <div>
      <div className="border-b bg-card">
        <div className="container px-4 sm:px-6 py-10 lg:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2">Giao hàng</p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl italic">Đặt Lịch Giao Hàng</h1>
          <div className="flex items-center gap-1.5 mt-3">
            <div className="h-0.5 w-10 bg-primary rounded-full" />
            <div className="h-0.5 w-4 bg-primary/40 rounded-full" />
          </div>
          <p className="text-muted-foreground mt-3 max-w-xl">
            Điền thông tin bên dưới, chúng tôi sẽ liên hệ xác nhận và giao đúng giờ bạn yêu cầu.
          </p>
        </div>
      </div>
      <div className="container px-4 sm:px-6 py-10 max-w-2xl">
        <BookingForm products={products} />
      </div>
    </div>
  )
}
