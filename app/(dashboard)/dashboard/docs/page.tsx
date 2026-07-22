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
1. Vào **Dashboard → Bài viết** → nhấn **"Tạo bài viết"** góc phải trên
2. Nhập tiêu đề bài
3. Soạn nội dung trong ô editor (xem hướng dẫn định dạng bên dưới)
4. Chọn danh mục bằng nút **Category** trên toolbar editor
5. Thêm ảnh bìa ở cột phải → nhập URL hoặc nhấn "Tải lên"
6. Nhấn **"Lưu"** để lưu nháp, hoặc bật **"Đã đăng"** để hiển thị trên web

## Định dạng nội dung (TipTap editor)

Chọn văn bản rồi nhấn icon trên toolbar để định dạng:

| Định dạng | Cách làm |
|---|---|
| Tiêu đề H2, H3 | Toolbar → H2 / H3 |
| In đậm | Ctrl+B hoặc toolbar **B** |
| In nghiêng | Ctrl+I hoặc toolbar *I* |
| Gạch chân | Ctrl+U hoặc toolbar U |
| Danh sách chấm | Toolbar → danh sách • |
| Danh sách số | Toolbar → danh sách 1. |
| Chèn ảnh | Toolbar → icon ảnh → nhập URL hoặc tải lên |
| Chèn link | Chọn text → toolbar → icon link → dán URL |
| Trích dẫn (blockquote) | Toolbar → icon " |
| Bảng | Toolbar → icon bảng |
| 2 cột | Toolbar → icon 2 cột |
| Xóa định dạng | Toolbar → icon tẩy |

## Tags (nhãn bài viết)
- Mở accordion **"Tags"** bên phải editor
- Nhấn tag có sẵn để gán, hoặc gõ tên mới → Enter để tạo và gán ngay
- Tags giúp khách lọc bài theo chủ đề tại \`/blog?tag=...\`

## Bài liên quan
- Mở accordion **"Bài liên quan"** bên phải
- Tìm và chọn tối đa 4 bài để gợi ý cuối trang bài viết

## SEO
- Mở accordion **"SEO"** bên phải
- Điền **SEO Title** (50–60 ký tự), **Mô tả** (150–160 ký tự), **Từ khoá** (5–10 từ ngăn cách bằng dấu phẩy)
- SEO Image: URL ảnh hiển thị khi chia sẻ lên Facebook/Zalo

## Template bài viết
| Template | Khi nào dùng |
|---|---|
| Standard | Bài thông thường |
| Wide | Bài có nhiều ảnh, cần không gian rộng |
| Minimal | Ẩn tác giả và danh mục — dùng cho trang đặc biệt |

## Đặt lịch đăng tự động
- Mở accordion **"Lên lịch"** bên phải
- Chọn ngày và giờ muốn đăng
- Bài sẽ tự động publish vào giờ đó (cron chạy mỗi giờ)

## Lưu ý
- Bài chưa publish **không hiện** trên trang công khai
- Dùng **"Nổi bật"** (Featured) để ghim bài lên khu vực đặc biệt trang chủ
- Nên điền đủ SEO trước khi đăng`,
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
    key: "tags",
    title: "Tags",
    content: `# Hướng dẫn quản lý Tags

Tags (nhãn) giúp phân loại bài viết chi tiết hơn danh mục. Khách có thể lọc bài theo tag tại trang /blog hoặc /tags/[slug].

## Tạo tag mới
1. Vào **Dashboard → Tags** → nhấn **"Tạo tag"**
2. Nhập tên tag → Lưu
3. Slug tự tạo từ tên (ví dụ: "Heo Quay" → slug "heo-quay")

## Gán tag vào bài viết
1. Vào editor bài viết
2. Mở accordion **"Tags"** ở cột phải
3. Nhấn tag có sẵn để gán (nhấn lại để bỏ gán)
4. Hoặc gõ tên tag mới → nhấn **Enter** → tag được tạo và gán ngay

## Xóa tag
- Vào Dashboard → Tags → nhấn icon thùng rác
- Chỉ **ADMIN** mới xóa được tag
- Xóa tag **không xóa bài viết**, chỉ gỡ nhãn khỏi tất cả bài đang dùng tag đó

## Tags hiển thị ở đâu?
| Vị trí | Mô tả |
|---|---|
| Trang /blog | Hiển thị pills lọc theo tag bên dưới filter danh mục |
| Trang /tags/[slug] | Danh sách bài viết theo tag |
| Kết quả tìm kiếm | Hiển thị tag badges trên mỗi kết quả |
| Trang bài viết | Tags hiển thị cuối bài |

## Lưu ý
- Tên tag nên ngắn gọn, 1–3 từ
- Không tạo quá nhiều tag trùng nghĩa (ví dụ: "Heo Quay" và "heo-quay" là khác nhau)
- Một bài viết có thể gán nhiều tag cùng lúc`,
  },
  {
    key: "thuc-don",
    title: "Thực đơn",
    content: `# Hướng dẫn quản lý Thực đơn

Trang public: **/thuc-don** — hiển thị toàn bộ nhóm món và giá cho khách.

## Cấu trúc
- **Nhóm món** (DishGroup): ví dụ "Heo Quay", "Gà Quay", "Vịt Quay"
- **Món ăn** (Dish): thuộc một nhóm, có tên, giá, mô tả, trạng thái có sẵn/hết

## Thêm nhóm món
1. Vào **Dashboard → Thực đơn**
2. Nhấn **"Thêm nhóm"**
3. Nhập tên nhóm → Lưu
4. Kéo thả để sắp xếp thứ tự các nhóm

## Thêm món vào nhóm
1. Nhấn **"Thêm món"** trong nhóm tương ứng
2. Điền:
   - **Tên món** (bắt buộc)
   - **Giá** (VND, để trống nếu chưa có giá)
   - **Mô tả** (ngắn gọn, 1–2 dòng)
   - **Ảnh** (URL ảnh món)
3. Lưu

## Cập nhật giá
- Nhấn icon chỉnh sửa ✏️ bên cạnh tên món
- Sửa giá → Lưu
- Thay đổi hiển thị trên web ngay lập tức

## Đánh dấu hết hàng
- Toggle **"Có sẵn / Hết"** bên cạnh từng món
- Khi **Hết**: món vẫn hiển thị trên web nhưng có nhãn "Hết" màu đỏ
- Khi có lại hàng: bật toggle trở lại

## Xóa nhóm / món
- Xóa món: icon thùng rác bên cạnh tên món
- Xóa nhóm: nhấn "Xóa nhóm" — **xóa nhóm sẽ xóa toàn bộ món trong nhóm**

## Lưu ý
- Giá hiển thị định dạng: 250.000 ₫
- Số điện thoại đặt hàng lấy từ **Dashboard → Settings → Số điện thoại**
- Trang /thuc-don có CTA "Đặt hàng ngay" liên kết đến /dat-lich`,
  },
  {
    key: "newsletter",
    title: "Newsletter",
    content: `# Hướng dẫn quản lý Newsletter

## Khách đăng ký như thế nào?
- Form **"Đăng ký nhận tin"** nằm ở footer của website
- Khách nhập email → nhấn "Đăng ký"
- Hệ thống tự lưu vào danh sách subscribers

## Xem danh sách subscribers
1. Vào **Dashboard → Subscribers**
2. Lọc theo tab:
   - **Đang đăng ký**: email đang hoạt động
   - **Đã hủy**: đã bấm hủy đăng ký
   - **Tất cả**: toàn bộ
3. Header hiển thị tổng số người đang đăng ký

## Hủy đăng ký cho một người
- Nhấn **"Hủy đăng ký"** ở cuối hàng
- Email vẫn còn trong hệ thống nhưng chuyển sang trạng thái "Đã hủy"
- Nếu người đó đăng ký lại, hệ thống tự kích hoạt lại

## Xuất danh sách (Export CSV)
- Nhấn **"Xuất CSV"** góc phải trên
- File tải về gồm: Email, Tên, Ngày đăng ký
- Chỉ xuất danh sách **đang hoạt động** (không bao gồm đã hủy)
- Dùng file này để gửi email marketing qua Mailchimp, GetResponse...

## Lưu ý
- Hệ thống **không tự gửi email newsletter** — chỉ quản lý danh sách
- Để gửi email hàng loạt: xuất CSV → import vào công cụ email marketing
- Khách có thể tự hủy qua link trong email (nếu bạn thêm link /api/newsletter/unsubscribe?token=...)`,
  },
  {
    key: "settings",
    title: "Cài đặt",
    content: `# Hướng dẫn Cài đặt & Go Live

## Cấu hình cơ bản (bắt buộc điền trước khi go live)

Vào **Dashboard → Cài đặt** để điền:

| Trường | Mô tả | Ví dụ |
|---|---|---|
| Tên website | Hiển thị trên tab trình duyệt và footer | Heo Quay Bình Tân |
| Tagline | Dòng phụ bên dưới tên site | Hương vị gia truyền... |
| Mô tả ngắn | Mô tả SEO, hiển thị khi chia sẻ link | Chuyên heo quay, vịt quay... |
| Logo | Nhấn "Chọn ảnh" để upload logo (nên vuông, tối thiểu 200×200px) | — |
| Ảnh Hero Banner | Ảnh nền trang chủ mặc định | — |
| Ảnh section Về chúng tôi | Ảnh bên phải phần giới thiệu trang chủ | — |

## Nội dung từng trang

Tất cả text hiển thị trên website đều chỉnh được trong dashboard — không cần sửa code.

### Trang chủ → Dashboard → Giao diện (tab "Trang chủ")
- Tiêu đề, nhãn nhỏ, màu nền / ảnh nền cho từng section
- Nội dung rich text "Về chúng tôi" (in đậm, danh sách, link)
- Các nút CTA, tiêu đề banner đặt lịch cuối trang
- Tick nhóm món muốn hiển thị trong section Thực đơn & Bảng giá

### Trang /about → Dashboard → Về chúng tôi
- **Câu chuyện**: 2 đoạn văn giới thiệu thương hiệu
- **Thống kê**: 3 con số nổi bật (số năm, khách hàng, món đặc trưng)
- **Quy trình**: 4 bước từ nguyên liệu đến bàn ăn
- **Cam kết**: 4 điểm cam kết chất lượng
- **CTA cuối trang**: tiêu đề, mô tả, text 2 nút (nút 1 gọi điện, nút 2 link tùy chỉnh)

### Trang /lien-he → Dashboard → Liên hệ
- Số điện thoại, Zalo, email, địa chỉ
- Đoạn giới thiệu phía trên form
- Mạng xã hội (Facebook, Instagram, YouTube)

### Trang /dat-lich → Dashboard → Giao diện (tab "Trang Đặt lịch")
- **Ảnh banner**: nhấn "Chọn ảnh" để upload ảnh riêng (để trống → dùng ảnh Hero chung)
- **Tiêu đề chính** (h1): hiển thị trên ảnh banner
- **Nhãn nhỏ** phía trên tiêu đề
- **4 cam kết**: text 4 dòng cam kết giao hàng bên trái form
- **Tiêu đề section cam kết**
- **Mô tả form**: dòng chú thích bên dưới tiêu đề "Thông tin đặt hàng"

### Trang /thuc-don → Dashboard → Giao diện (tab "Trang Thực đơn")
- **Ảnh banner**: nhấn "Chọn ảnh" để upload ảnh riêng (để trống → dùng ảnh Hero chung)
- **Subtitle**: dòng phụ bên dưới chữ "Thực đơn" trên hero banner

## Upload ảnh

Tất cả trường ảnh trong dashboard đều có nút **"Chọn ảnh"** để upload từ máy tính:
- Định dạng: JPG, PNG, WebP
- Ảnh tự động lưu lên Supabase Storage
- Để trống → dùng ảnh mặc định (thường là Ảnh Hero Banner từ Cài đặt)

## Robots.txt (kiểm soát Google)
- Mặc định: Google **được phép** index toàn bộ trang công khai
- Không cần thay đổi gì nếu muốn Google tìm thấy website
- Nếu cần chặn trang nào đó: vào Cài đặt → Robots.txt → thêm dòng \`Disallow: /đường-dẫn/\`

## Sitemap
- Tự động tạo tại: **https://heoquaybinhtan.vercel.app/sitemap.xml**
- Bao gồm: trang chủ, blog, danh mục, thực đơn, đặt lịch, tất cả bài viết đã đăng
- Gửi URL sitemap lên **Google Search Console** sau khi go live

## Checklist go live
- [ ] Dashboard → Cài đặt: điền tên site, SĐT, địa chỉ, upload logo
- [ ] Dashboard → Liên hệ: điền đầy đủ thông tin liên hệ và mạng xã hội
- [ ] Dashboard → Về chúng tôi: viết câu chuyện thương hiệu, thống kê, quy trình
- [ ] Dashboard → Giao diện: upload ảnh banner cho trang Đặt lịch và Thực đơn
- [ ] Dashboard → Cài đặt → bật toggle "Cho phép Google index"
- [ ] Đăng bài viết đầu tiên (published = true)
- [ ] Thêm ít nhất 3–5 món vào Thực đơn
- [ ] Gửi sitemap lên Google Search Console
- [ ] Test form đặt lịch — nhận email xác nhận chưa`,
  },
  {
    key: "general",
    title: "Chung",
    content: `# Hướng dẫn chung

## Tài khoản
- Thay đổi tên và ảnh đại diện tại trang **Profile** (nhấn avatar góc phải dashboard)
- Đổi mật khẩu tại Profile → mật khẩu phải có 8+ ký tự, chữ hoa, số, ký tự đặc biệt
- Quên mật khẩu: dùng **"Quên mật khẩu"** ở trang đăng nhập → nhận email reset

## Upload ảnh
- Hỗ trợ: JPG, PNG, WebP — tối đa 5MB
- Ảnh bìa bài viết nên tỷ lệ **16:9** (ví dụ: 1200×675px)
- Ảnh avatar nên tỷ lệ **1:1** (vuông)
- Có thể dùng URL ảnh từ nguồn ngoài thay vì tải lên

## Bình luận
- Vào **Dashboard → Bình luận** để xem và xóa bình luận từ khách
- Khách không cần đăng nhập để bình luận
- Có thể lọc bình luận theo trạng thái

## Thông báo
- Chuông 🔔 ở góc phải header dashboard tự cập nhật mỗi 30 giây
- Sẽ có thông báo khi: bình luận mới, bài viết đăng theo lịch thành công
- Nhấn chuông → xem tất cả thông báo

## Đặt lịch (Bookings)
- Vào **Dashboard → Đặt lịch** để xem đơn hàng từ khách
- Mỗi đơn gồm: tên, SĐT, địa chỉ, món chọn, ngày giao
- Chỉ nhận đơn giao **Thứ 2 – Thứ 7** (hệ thống tự chặn Chủ nhật)

## Tìm kiếm nhanh
- Thanh tìm kiếm 🔍 ở góc phải dashboard → tìm nhanh bài viết theo tiêu đề`,
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

### Thực đơn & Tags

| Chức năng | ADMIN | EDITOR | CONTRIBUTOR |
|---|:---:|:---:|:---:|
| Xem / quản lý nhóm món và món | ✅ | ✅ | ❌ |
| Quản lý Tags | ✅ | ✅ | ❌ |
| Quản lý Subscribers | ✅ | ✅ | ❌ |

### Menu & Trang tĩnh

| Chức năng | ADMIN | EDITOR | CONTRIBUTOR |
|---|:---:|:---:|:---:|
| Quản lý menu điều hướng | ✅ | ✅ | ❌ |
| Tạo / sửa / xoá trang tĩnh | ✅ | ❌ | ❌ |

### Giao diện & Cấu hình

| Chức năng | ADMIN | EDITOR | CONTRIBUTOR |
|---|:---:|:---:|:---:|
| Cấu hình site (tên, logo, hotline...) | ✅ | ❌ | ❌ |
| Giao diện homepage (màu, ảnh nền, nhóm món) | ✅ | ❌ | ❌ |
| Trang Về chúng tôi / Liên hệ | ✅ | ✅ | ❌ |
| Hướng dẫn sử dụng (Docs) — đọc | ✅ | ✅ | ❌ |
| Hướng dẫn sử dụng (Docs) — chỉnh sửa | ✅ | ❌ | ❌ |

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
