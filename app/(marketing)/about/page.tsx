import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description: "Tìm hiểu về Heo Quay 47 - chuyên cung cấp heo quay, vịt quay, gà quay chất lượng cao.",
}

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            Về chúng tôi
          </h1>
          <p className="text-xl text-muted-foreground">
            Chuyên cung cấp heo quay, vịt quay, gà quay chất lượng cao.
          </p>
        </div>
      </div>

      <hr className="my-8" />

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section className="space-y-4">
          <h2 className="font-heading text-2xl">Câu chuyện của chúng tôi</h2>
          <p className="leading-relaxed text-muted-foreground">
            Heo Quay 47 được thành lập với niềm đam mê ẩm thực truyền thống. Chúng tôi tự hào
            mang đến những món quay đặc sắc được chế biến theo công thức gia truyền, giữ nguyên
            hương vị đậm đà và lớp da giòn rụm đặc trưng.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Với nhiều năm kinh nghiệm trong nghề, đội ngũ đầu bếp của chúng tôi luôn tận tâm
            chọn lọc nguyên liệu tươi ngon nhất, kết hợp với bí quyết ướp gia vị độc đáo để
            tạo nên những món ăn hoàn hảo.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border bg-background p-6 space-y-2">
            <div className="text-4xl font-bold font-heading">10+</div>
            <div className="font-medium">Năm kinh nghiệm</div>
            <p className="text-sm text-muted-foreground">
              Gắn bó với nghề hơn một thập kỷ
            </p>
          </div>
          <div className="rounded-lg border bg-background p-6 space-y-2">
            <div className="text-4xl font-bold font-heading">1000+</div>
            <div className="font-medium">Khách hàng hài lòng</div>
            <p className="text-sm text-muted-foreground">
              Phục vụ hàng nghìn lượt khách mỗi tháng
            </p>
          </div>
          <div className="rounded-lg border bg-background p-6 space-y-2">
            <div className="text-4xl font-bold font-heading">3</div>
            <div className="font-medium">Món đặc trưng</div>
            <p className="text-sm text-muted-foreground">
              Heo quay, Vịt quay, Gà quay
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl">Cam kết của chúng tôi</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3">
              <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold">✓</div>
              <div>
                <div className="font-medium">Nguyên liệu tươi sạch</div>
                <p className="text-sm text-muted-foreground">Chọn lọc từ các nhà cung cấp uy tín, đảm bảo vệ sinh an toàn thực phẩm.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold">✓</div>
              <div>
                <div className="font-medium">Công thức gia truyền</div>
                <p className="text-sm text-muted-foreground">Bí quyết ướp và nướng đặc biệt tạo nên hương vị độc đáo không đâu có.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold">✓</div>
              <div>
                <div className="font-medium">Giao hàng tận nơi</div>
                <p className="text-sm text-muted-foreground">Phục vụ đặt hàng online, giao tận nơi nhanh chóng và đúng giờ.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold">✓</div>
              <div>
                <div className="font-medium">Giá cả hợp lý</div>
                <p className="text-sm text-muted-foreground">Chất lượng cao với mức giá phải chăng, phù hợp với mọi nhu cầu.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl">Liên hệ</h2>
          <div className="rounded-lg border bg-background p-6 space-y-3 text-muted-foreground">
            <p>📍 <span className="font-medium text-foreground">Địa chỉ:</span> 47 Đường Ẩm Thực, TP. Hồ Chí Minh</p>
            <p>📞 <span className="font-medium text-foreground">Điện thoại:</span> 0901 234 567</p>
            <p>🕐 <span className="font-medium text-foreground">Giờ mở cửa:</span> 06:00 – 20:00 hàng ngày</p>
          </div>
        </section>
      </div>
    </div>
  )
}
