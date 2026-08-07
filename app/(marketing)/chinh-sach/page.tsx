export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { siteConfig } from "@/config/site"
import { PageEntrance, FadeUp } from "@/components/motion-primitives"

export async function generateMetadata() {
  const row = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (row?.data ?? {}) as Record<string, string>
  const siteName = cfg.siteName?.trim() || "Heo Quay Bình Tân"
  return {
    title: `Chính sách`,
    description: `Chính sách bảo mật, điều khoản sử dụng, chính sách cookie và hoàn tiền của ${siteName}.`,
    alternates: { canonical: `${siteConfig.url}/chinh-sach` },
    openGraph: {
      title: `Chính sách | ${siteName}`,
      url: `${siteConfig.url}/chinh-sach`,
      locale: "vi_VN",
    },
  }
}

const sections = [
  {
    id: "bao-mat",
    label: "Bảo mật",
    title: "Chính sách bảo mật",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    content: [
      {
        heading: "1. Thông tin chúng tôi thu thập",
        body: "Chúng tôi có thể thu thập các thông tin bạn cung cấp khi đặt hàng, liên hệ hoặc đăng ký nhận tin, bao gồm: họ tên, số điện thoại, địa chỉ giao hàng và địa chỉ email.",
      },
      {
        heading: "2. Mục đích sử dụng thông tin",
        body: "Thông tin được dùng để xử lý đơn hàng, liên lạc xác nhận đặt hàng, giao hàng đúng địa chỉ và gửi thông báo khuyến mãi (nếu bạn đồng ý). Chúng tôi không bán hoặc chia sẻ thông tin cá nhân cho bên thứ ba vì mục đích thương mại.",
      },
      {
        heading: "3. Bảo mật dữ liệu",
        body: "Chúng tôi áp dụng các biện pháp kỹ thuật phù hợp để bảo vệ thông tin của bạn khỏi truy cập trái phép, mất mát hoặc tiết lộ. Dữ liệu được lưu trữ trên hệ thống máy chủ an toàn.",
      },
      {
        heading: "4. Quyền của bạn",
        body: "Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân của mình bất cứ lúc nào bằng cách liên hệ trực tiếp với chúng tôi qua số điện thoại hoặc email.",
      },
    ],
  },
  {
    id: "dieu-khoan",
    label: "Điều khoản",
    title: "Điều khoản sử dụng",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    content: [
      {
        heading: "1. Chấp nhận điều khoản",
        body: "Khi sử dụng website hoặc đặt hàng tại cửa hàng, bạn đồng ý tuân thủ các điều khoản sử dụng này. Nếu không đồng ý, vui lòng không sử dụng dịch vụ.",
      },
      {
        heading: "2. Đặt hàng & xác nhận",
        body: "Đơn hàng được xác nhận sau khi chúng tôi liên hệ lại qua điện thoại hoặc Zalo. Chúng tôi có quyền từ chối hoặc hủy đơn hàng trong trường hợp hàng hết hoặc thông tin đặt hàng không hợp lệ.",
      },
      {
        heading: "3. Giá cả & thanh toán",
        body: "Giá niêm yết trên website có thể thay đổi theo thời điểm. Thanh toán bằng tiền mặt khi nhận hàng hoặc chuyển khoản ngân hàng theo thỏa thuận. Chúng tôi xác nhận giá chính xác khi nhận đơn.",
      },
      {
        heading: "4. Sở hữu trí tuệ",
        body: "Toàn bộ nội dung, hình ảnh và thương hiệu trên website thuộc quyền sở hữu của chúng tôi. Nghiêm cấm sao chép, sử dụng thương mại mà không có sự đồng ý bằng văn bản.",
      },
    ],
  },
  {
    id: "cookie",
    label: "Cookie",
    title: "Chính sách Cookie",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="8" cy="9" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="8" r="1" fill="currentColor" stroke="none" />
        <circle cx="14" cy="14" r="1" fill="currentColor" stroke="none" />
        <circle cx="9" cy="15" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    content: [
      {
        heading: "1. Cookie là gì?",
        body: "Cookie là các tệp văn bản nhỏ được lưu trên thiết bị của bạn khi truy cập website. Chúng giúp website hoạt động hiệu quả hơn và cải thiện trải nghiệm người dùng.",
      },
      {
        heading: "2. Chúng tôi dùng cookie để làm gì?",
        body: "Cookie được dùng để ghi nhớ tùy chọn của bạn, phân tích lưu lượng truy cập (qua Google Analytics), và đảm bảo phiên đăng nhập hoạt động ổn định.",
      },
      {
        heading: "3. Kiểm soát cookie",
        body: "Bạn có thể tắt cookie trong cài đặt trình duyệt. Tuy nhiên, một số tính năng của website có thể không hoạt động đúng nếu cookie bị vô hiệu hóa.",
      },
      {
        heading: "4. Cookie bên thứ ba",
        body: "Website có thể sử dụng cookie từ các dịch vụ bên thứ ba như Google Analytics. Các cookie này tuân theo chính sách bảo mật của nhà cung cấp tương ứng.",
      },
    ],
  },
  {
    id: "hoan-tien",
    label: "Hoàn tiền",
    title: "Chính sách hoàn tiền & đổi trả",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    content: [
      {
        heading: "1. Điều kiện đổi trả",
        body: "Chúng tôi chấp nhận đổi trả trong trường hợp: sản phẩm bị hư hỏng do vận chuyển, giao nhầm món so với đơn đặt, hoặc chất lượng không đảm bảo so với tiêu chuẩn đã cam kết.",
      },
      {
        heading: "2. Thời hạn khiếu nại",
        body: "Vui lòng kiểm tra sản phẩm ngay khi nhận hàng và phản ánh trong vòng 30 phút nếu có vấn đề. Khiếu nại sau thời gian này có thể không được xử lý do đặc thù của thực phẩm tươi sống.",
      },
      {
        heading: "3. Quy trình xử lý",
        body: "Liên hệ trực tiếp qua điện thoại hoặc Zalo với đầy đủ thông tin đơn hàng và hình ảnh chứng minh. Chúng tôi sẽ xử lý trong vòng 24 giờ làm việc và thông báo phương án giải quyết.",
      },
      {
        heading: "4. Hoàn tiền",
        body: "Trong trường hợp đủ điều kiện hoàn tiền, chúng tôi sẽ hoàn lại 100% giá trị đơn hàng qua phương thức thanh toán ban đầu hoặc chuyển khoản ngân hàng trong vòng 3–5 ngày làm việc.",
      },
    ],
  },
]

export default async function PolicyPage() {
  const row = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (row?.data ?? {}) as Record<string, string>
  const siteName = cfg.siteName?.trim() || "Heo Quay Bình Tân"

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <PageEntrance>
        <div className="relative overflow-hidden" style={{ minHeight: 240 }}>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-500 to-orange-400" />
          <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
            <svg width="100%" height="100%">
              <pattern id="policy-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#policy-dots)" />
            </svg>
          </div>
          <div className="relative z-10 container px-4 sm:px-6 py-14 lg:py-20 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3 text-orange-200">{siteName}</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl mb-4 drop-shadow-sm">Chính sách</h1>
            <div className="flex items-center gap-2 mb-5">
              <div className="h-1 w-12 rounded-full bg-orange-400" />
              <div className="h-1 w-5 rounded-full bg-orange-300/50" />
            </div>
            <p className="text-base sm:text-lg max-w-xl leading-relaxed text-white/85">
              Thông tin về chính sách bảo mật, điều khoản sử dụng, cookie và hoàn tiền của {siteName}.
            </p>
          </div>
        </div>
      </PageEntrance>

      {/* Quick nav */}
      <div className="sticky top-[80px] z-30 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="container px-4 sm:px-6 py-12 lg:py-16 space-y-16 max-w-4xl">

        {sections.map((section, i) => (
          <FadeUp key={section.id}>
            <section id={section.id} className="scroll-mt-36">
              {/* Section header */}
              <div className="flex items-start gap-4 mb-8">
                <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {section.icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-1">
                    {i === 0 ? "Privacy Policy" : i === 1 ? "Terms of Service" : i === 2 ? "Cookie Policy" : "Refund Policy"}
                  </p>
                  <h2 className="font-heading text-2xl sm:text-3xl">{section.title}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-1 w-10 bg-primary rounded-full" />
                    <div className="h-1 w-4 bg-primary/30 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="rounded-xl border bg-card overflow-hidden divide-y shadow-sm">
                {section.content.map((item) => (
                  <div key={item.heading} className="px-6 py-5 hover:bg-muted/30 transition-colors">
                    <h3 className="font-semibold text-sm mb-2">{item.heading}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </FadeUp>
        ))}

        {/* Last updated */}
        <FadeUp>
          <div className="rounded-xl bg-muted/50 border px-6 py-5 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Cập nhật lần cuối:</span> Tháng 8 năm 2026.{" "}
            Nếu bạn có thắc mắc về các chính sách trên, vui lòng liên hệ trực tiếp với {siteName}.
          </div>
        </FadeUp>

      </div>
    </div>
  )
}
