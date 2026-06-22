import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description: "Tìm hiểu về Heo Quay 47 - chuyên cung cấp heo quay, vịt quay, gà quay chất lượng cao.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* Hero header */}
      <div className="border-b bg-muted/30">
        <div className="container max-w-4xl px-4 sm:px-6 py-12 lg:py-16">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-3">
            Về chúng tôi
          </h1>
          <p className="text-muted-foreground text-lg">
            Chuyên cung cấp heo quay, vịt quay, gà quay chất lượng cao.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl px-4 sm:px-6 py-10 lg:py-14 space-y-14">

        {/* Story */}
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

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { number: "10+", label: "Năm kinh nghiệm", desc: "Gắn bó với nghề hơn một thập kỷ" },
            { number: "1000+", label: "Khách hàng hài lòng", desc: "Phục vụ hàng nghìn lượt khách mỗi tháng" },
            { number: "3", label: "Món đặc trưng", desc: "Heo quay, Vịt quay, Gà quay" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border bg-card p-6 text-center space-y-1">
              <div className="font-heading text-4xl font-bold text-primary">{stat.number}</div>
              <div className="font-semibold text-sm">{stat.label}</div>
              <p className="text-xs text-muted-foreground">{stat.desc}</p>
            </div>
          ))}
        </section>

        {/* Commitments */}
        <section className="space-y-5">
          <h2 className="font-heading text-2xl">Cam kết của chúng tôi</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "Nguyên liệu tươi sạch", desc: "Chọn lọc từ các nhà cung cấp uy tín, đảm bảo vệ sinh an toàn thực phẩm." },
              { title: "Công thức gia truyền", desc: "Bí quyết ướp và nướng đặc biệt tạo nên hương vị độc đáo không đâu có." },
              { title: "Giao hàng tận nơi", desc: "Phục vụ đặt hàng online, giao tận nơi nhanh chóng và đúng giờ." },
              { title: "Giá cả hợp lý", desc: "Chất lượng cao với mức giá phải chăng, phù hợp với mọi nhu cầu." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-2xl border bg-card p-5">
                <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">{item.title}</div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-5">
          <h2 className="font-heading text-2xl">Liên hệ</h2>
          <div className="rounded-2xl border bg-card divide-y overflow-hidden">
            {[
              { icon: "📍", label: "Địa chỉ", value: "47 Đường Ẩm Thực, TP. Hồ Chí Minh" },
              { icon: "📞", label: "Điện thoại", value: "0901 234 567" },
              { icon: "🕐", label: "Giờ mở cửa", value: "06:00 – 20:00 hàng ngày" },
            ].map((contact) => (
              <div key={contact.label} className="flex items-center gap-4 px-6 py-4">
                <span className="text-xl shrink-0">{contact.icon}</span>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="text-sm font-semibold shrink-0">{contact.label}:</span>
                  <span className="text-sm text-muted-foreground">{contact.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
