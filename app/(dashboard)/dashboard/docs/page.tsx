import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { DocsEditor } from "@/components/docs-editor"

export const metadata = { title: "Hướng dẫn sử dụng" }

const DEFAULT_DOCS = [
  {
    key: "posts",
    title: "Bài viết",
    content: `# Hướng dẫn tạo bài viết

## Tạo bài mới
1. Vào Dashboard → nhấn nút "Tạo bài viết" góc phải trên
2. Nhập tiêu đề, nội dung bằng editor
3. Chọn danh mục bằng nút Category trên toolbar
4. Thêm ảnh bìa ở cột bên phải
5. Nhấn "Lưu" để lưu nháp, hoặc "Publish" để đăng bài

## Định dạng nội dung
- Heading: gõ /heading hoặc nhấn # ở đầu dòng
- Danh sách: gõ /list
- Ảnh: gõ /image → nhập URL hoặc tải lên
- Trích dẫn: gõ /quote
- Code: gõ /code

## Bài liên quan
- Mở panel "Bài liên quan" bên phải khi soạn thảo
- Tìm và chọn tối đa 4 bài để gợi ý cuối trang

## Template bài viết
- Standard: bố cục thông thường
- Wide: nội dung rộng hơn, phù hợp ảnh nhiều
- Minimal: ẩn tác giả, danh mục — dùng cho trang đặc biệt

## Lưu ý
- Bài chưa publish sẽ không hiện trên trang công khai
- Dùng "Featured" để ghim bài lên trang chủ
- SEO: điền đầy đủ title/description để tối ưu Google`,
  },
  {
    key: "categories",
    title: "Danh mục",
    content: `# Hướng dẫn quản lý danh mục

## Tạo danh mục mới
1. Vào Dashboard → Categories → nhấn "Tạo danh mục"
2. Nhập tên (slug tự tạo từ tên)
3. Chọn template hiển thị
4. Lưu

## Template danh mục
- Standard: danh sách dọc, ảnh nhỏ bên trái
- Grid: lưới 2-3 cột, nổi bật ảnh bìa
- Hero: banner ảnh lớn phía trên + lưới bài bên dưới

## Ảnh danh mục
- Nhấn vào ô ảnh nhỏ trong hàng để đổi ảnh
- Nhập URL ảnh hoặc tải lên từ máy
- Ảnh nên có tỷ lệ 16:9

## Banner (Hero template)
- Nhấn icon ảnh ở hàng danh mục
- Cấu hình màu nền, tiêu đề, mô tả overlay
- Chỉ hiển thị khi dùng template Hero

## Sắp xếp thứ tự
- Kéo thả các hàng để thay đổi thứ tự hiển thị trên menu và trang danh mục

## SEO
- Nhấn icon kính lúp để mở panel SEO
- Điền Title, Description, Keywords riêng cho từng danh mục`,
  },
  {
    key: "menu",
    title: "Menu",
    content: `# Hướng dẫn quản lý menu

## Thêm mục menu
1. Vào Dashboard → Menu → nhấn "Thêm mục"
2. Nhập tiêu đề hiển thị
3. Chọn loại:
   - **Danh mục**: liên kết đến trang danh mục có sẵn
   - **Tùy chỉnh**: nhập URL bất kỳ (dùng cho trang ngoài hoặc /about, /lien-he...)
4. Lưu

## Sắp xếp
- Kéo thả để đổi thứ tự hiển thị trên thanh điều hướng
- Menu hiển thị tối đa 5 mục trực tiếp, mục thừa vào dropdown "Khác"

## Bật/tắt mục
- Dùng toggle để ẩn tạm mục menu mà không xóa

## Lưu ý
- Nếu DB menu trống, hệ thống tự dùng menu mặc định trong config
- Tên menu ngắn gọn (1-3 từ) để hiển thị đẹp trên mobile`,
  },
  {
    key: "general",
    title: "Chung",
    content: `# Hướng dẫn chung

## Phân quyền
| Role | Quyền |
|---|---|
| ADMIN | Toàn quyền: tạo/sửa/xóa bài, danh mục, menu, quản lý user |
| EDITOR | Tạo/sửa bài, quản lý danh mục và menu (không quản lý user) |
| CONTRIBUTOR | Chỉ xem dashboard, không tạo được bài |

## Tài khoản
- Thay đổi tên và ảnh đại diện tại trang Profile
- Đổi mật khẩu tại Profile → mật khẩu phải có 8+ ký tự, chữ hoa, số, ký tự đặc biệt
- Session tự hết hạn sau 1 ngày, cần đăng nhập lại

## Upload ảnh
- Hỗ trợ JPG, PNG, WebP, GIF — tối đa 5MB
- Ảnh bìa bài viết nên tỷ lệ 16:9
- Hoặc dùng URL ảnh từ nguồn ngoài

## Bình luận
- Vào Dashboard → Comments để duyệt/xóa bình luận
- Bình luận của người dùng không cần đăng nhập

## Tìm kiếm
- Thanh tìm kiếm ở góc phải dashboard tìm nhanh bài viết`,
  },
]

export default async function DocsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const isAdmin = (user as any).role === "ADMIN"

  const dbDocs = await db.siteDoc.findMany()

  // Merge defaults with DB content
  const docs = DEFAULT_DOCS.map((d) => {
    const saved = dbDocs.find((db) => db.key === d.key)
    return saved ? { ...d, content: saved.content, title: saved.title } : d
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Hướng dẫn sử dụng"
        text="Ghi chú và hướng dẫn dành cho Admin và Editor."
      />
      <DocsEditor docs={docs} isAdmin={isAdmin} />
    </DashboardShell>
  )
}
