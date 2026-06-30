import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { DocsEditor } from "@/components/admin/docs-editor"

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
- Hệ thống hỗ trợ rating (đánh giá sao) kèm bình luận

## Thông báo
- Chuông thông báo ở góc phải header dashboard
- Tự động cập nhật mỗi 60 giây
- Có thông báo khi: có đặt lịch mới, bình luận mới, bài viết được đăng theo lịch

## Tìm kiếm
- Thanh tìm kiếm ở góc phải dashboard tìm nhanh bài viết`,
  },
  {
    key: "permissions",
    title: "Phân quyền",
    content: `# Phân quyền người dùng

## Các role hiện có

| Role | Mô tả |
|---|---|
| **ADMIN** | Quản trị viên — toàn quyền hệ thống |
| **EDITOR** | Biên tập viên — quản lý nội dung, không quản lý user |
| **CONTRIBUTOR** | Cộng tác viên — chỉ xem dashboard |

---

## Chi tiết quyền từng role

### Bài viết (Posts)

| Chức năng | ADMIN | EDITOR | CONTRIBUTOR |
|---|:---:|:---:|:---:|
| Xem danh sách bài viết | ✅ | ✅ | ✅ |
| Tạo bài viết mới | ✅ | ✅ | ❌ |
| Sửa bài viết | ✅ | ✅ | ❌ |
| Xoá bài viết | ✅ | ✅ | ❌ |
| Đăng / Huỷ đăng bài | ✅ | ✅ | ❌ |
| Đặt bài nổi bật (Featured) | ✅ | ✅ | ❌ |
| Đặt lịch đăng tự động | ✅ | ✅ | ❌ |
| Import / Export CSV | ✅ | ✅ | ❌ |

### Danh mục (Categories)

| Chức năng | ADMIN | EDITOR | CONTRIBUTOR |
|---|:---:|:---:|:---:|
| Xem danh sách | ✅ | ✅ | ✅ |
| Tạo danh mục mới | ✅ | ✅ | ❌ |
| Sửa tên / slug | ✅ | ✅ | ❌ |
| Đổi template / ảnh / SEO / banner | ✅ | ✅ | ❌ |
| Kéo thả sắp xếp thứ tự | ✅ | ✅ | ❌ |
| Xoá danh mục | ✅ | ✅ | ❌ |

### Đặt lịch (Bookings)

| Chức năng | ADMIN | EDITOR | CONTRIBUTOR |
|---|:---:|:---:|:---:|
| Xem danh sách đặt lịch | ✅ | ✅ | ❌ |
| Cập nhật trạng thái đơn | ✅ | ✅ | ❌ |

### Bình luận (Comments)

| Chức năng | ADMIN | EDITOR | CONTRIBUTOR |
|---|:---:|:---:|:---:|
| Xem bình luận | ✅ | ✅ | ❌ |
| Duyệt / Bỏ duyệt bình luận | ✅ | ✅ | ❌ |
| Xoá bình luận | ✅ | ✅ | ❌ |

### Menu & Trang tĩnh

| Chức năng | ADMIN | EDITOR | CONTRIBUTOR |
|---|:---:|:---:|:---:|
| Quản lý menu điều hướng | ✅ | ✅ | ❌ |
| Tạo / sửa / xoá trang tĩnh | ✅ | ✅ | ❌ |

### Giao diện & Cấu hình

| Chức năng | ADMIN | EDITOR | CONTRIBUTOR |
|---|:---:|:---:|:---:|
| Cấu hình site (tên, logo, hotline...) | ✅ | ❌ | ❌ |
| Giao diện homepage (màu, ảnh nền) | ✅ | ❌ | ❌ |
| Trang Về chúng tôi / Liên hệ | ✅ | ❌ | ❌ |
| Hướng dẫn sử dụng (Docs) | ✅ | ❌ | ❌ |
| Liên kết nhanh (Docs edit) | ✅ | ❌ | ❌ |

### Quản lý người dùng

| Chức năng | ADMIN | EDITOR | CONTRIBUTOR |
|---|:---:|:---:|:---:|
| Xem danh sách user | ✅ | ❌ | ❌ |
| Tạo user mới | ✅ | ❌ | ❌ |
| Sửa tên / email / avatar | ✅ | ❌ | ❌ |
| Đổi role (ADMIN/EDITOR/CONTRIBUTOR) | ✅ | ❌ | ❌ |
| Đổi mật khẩu user khác | ✅ | ❌ | ❌ |

---

## Tạo user mới

1. Vào **Dashboard → Người dùng**
2. Nhấn **"Tạo tài khoản"**
3. Nhập tên, email, mật khẩu và chọn role
4. Người dùng có thể đăng nhập ngay

## Đổi role

- Chỉ ADMIN mới đổi được role
- Vào Users → chọn người dùng → dropdown Role
- Thay đổi có hiệu lực ngay lập tức

## Lưu ý bảo mật

- Không nên tạo nhiều tài khoản ADMIN
- Mật khẩu tối thiểu 8 ký tự, 1 chữ hoa, 1 số, 1 ký tự đặc biệt
- Tài khoản bị khoá sau 5 lần đăng nhập sai liên tiếp (khoá 15 phút)`,
  },
]

export default async function DocsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const isAdmin = user.role === "ADMIN"

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
