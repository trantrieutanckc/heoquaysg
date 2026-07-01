# CMS Template — Tổng hợp tính năng

> Tài liệu này tổng hợp toàn bộ tính năng đã xây dựng. Dùng để nhân bản sang dự án mới.

---

## Stack kỹ thuật

| | |
|---|---|
| **Framework** | Next.js 13 App Router (server components + streaming) |
| **Database** | PostgreSQL · Prisma ORM |
| **Auth** | NextAuth.js · CredentialsProvider (email + bcrypt password) |
| **Storage** | Supabase Storage (REST API — không dùng SDK tránh lỗi WebSocket Node 20) |
| **Email** | Postmark (form liên hệ + reset password) |
| **Rich text editor** | EditorJS (bài viết) + TipTap v3 (section ngắn trong dashboard) |
| **Deploy** | Vercel · GitHub tự động deploy khi push |
| **UI** | Tailwind CSS · shadcn/ui · Radix UI |
| **Font** | Playfair Display (heading) |

---

## Cấu trúc Route Groups

```
app/
  (marketing)/     ← Trang công khai (không yêu cầu login)
  (dashboard)/     ← Quản trị viên (yêu cầu ADMIN hoặc EDITOR)
  (editor)/        ← Soạn thảo bài viết (yêu cầu ADMIN hoặc EDITOR)
  (auth)/          ← Đăng nhập, đăng ký, quên mật khẩu
  (profile)/       ← Trang profile cá nhân (yêu cầu login)
  api/             ← API routes
```

---

## Phân quyền (Role-based)

| Role | Dashboard | Tạo/sửa bài | Editor | Tags/Menu/Categories | Users |
|---|---|---|---|---|---|
| ADMIN | ✅ | ✅ (tất cả) | ✅ | ✅ | ✅ |
| EDITOR | ✅ | ✅ (bài của mình) | ✅ | ✅ | ❌ |
| CONTRIBUTOR | ✅ (xem) | ❌ | ❌ | ❌ | ❌ |

- Middleware Next.js bảo vệ `/dashboard`, `/editor`
- API routes kiểm tra session + role trước mọi action
- EDITOR chỉ sửa/xóa bài của chính mình

---

## Auth & Session

- **Đăng nhập**: email + password (bcrypt), form validate bằng Zod
- **Bảo vệ brute force**: lock 15 phút sau 5 lần sai (client-side + server-side)
- **Access token**: JWT 30 phút
- **Refresh token**: 7 ngày, lưu hash SHA-256 trong DB, rotation tự động, xóa khi signOut
- **Reset password**: qua email Postmark, model `EmailToken`, link hết hạn sau 1 giờ
- **Redirect sau login**: ADMIN/EDITOR → `/dashboard`, user thường → `/`
- **Redirect sau login từ trang bảo vệ**: `?from=/path` truyền qua URL, validate chỉ accept same-origin path

---

## Bài viết (Posts)

- CRUD đầy đủ với EditorJS: heading, paragraph, list, image, table, embed, code, delimiter
- Ảnh bìa: upload lên Supabase Storage hoặc nhập URL
- Gán nhiều category (many-to-many)
- Gán nhiều tag (many-to-many, tạo tag mới inline)
- SEO panel: title, description, keywords, og:image
- Chọn template layout: `standard` / `wide` / `minimal`
- Publish / unpublish / featured toggle
- **Bookable toggle**: đánh dấu bài có thể đặt lịch → hiện trong form `/dat-lich`
- **Giá sản phẩm**: field `price` (VND), hiện trên trang bài viết
- Đặt lịch đăng (`scheduledAt`) — cron job chạy mỗi giờ tự publish
- Bài liên quan: chọn thủ công trong editor (JSON array relatedPostIds), fallback theo category, hiện carousel responsive
- **Like/Unlike**: public (không cần login), deduplication bằng localStorage
- **Bình luận** (public): tên, email, nội dung + **đánh giá sao 1–5**
- **Rating tổng hợp**: `avgRating` + `ratingCount` trên Post, tính lại mỗi khi có comment mới
- Table of contents sidebar tự động từ headings (IntersectionObserver scroll-spy)
- **Share button**: Facebook, Twitter/X, copy link, Web Share API
- Import / Export CSV hàng loạt

---

## Trang bài viết — 3 template layout

| Template | Mô tả |
|---|---|
| `standard` | max-w-3xl, có sidebar ToC |
| `wide` | max-w-5xl, nội dung rộng |
| `minimal` | ẩn tác giả + category, giao diện sạch |

---

## Danh mục (Categories)

- CRUD + drag & drop sắp xếp thứ tự
- Ảnh danh mục, SEO riêng
- Chọn template layout: `standard` / `grid` / `hero`
- Bulk actions: publish/unpublish/delete

---

## Tags

- CRUD tag (slug tự sinh từ tên, hỗ trợ tiếng Việt)
- Gán tag cho bài viết trong editor (popover toggle + tạo mới inline)
- Filter `/blog?tag=slug` (pill dưới category tabs)
- Search theo title OR tag name
- Trang public `/tags/[slug]`
- Dashboard `/dashboard/tags`

---

## Search

- Tìm kiếm theo title bài viết + tag name (OR query)
- Hiển thị tag badges trên kết quả
- Lưu lịch sử tìm kiếm (≥3 ký tự) vào DB, deduplication
- Hiện 3 tìm kiếm gần nhất khi chưa có query
- Loading state với `useTransition`

---

## Menu điều hướng

- Menu động lấy từ DB (dashboard → `/dashboard/menu`)
- Fallback về `marketingConfig.mainNav` nếu DB trống
- Active state chính xác dùng `usePathname()`
- Overflow dropdown khi quá 5 mục

---

## Trang tĩnh (Pages)

- CRUD trang tĩnh với slug tùy chỉnh
- Editor nội dung (EditorJS)
- Ảnh bìa + banner (tĩnh hoặc slideshow tối đa 10 slide)
- SEO panel riêng
- Bulk actions
- Route public: `/pages/[slug]`

---

## Dashboard

### Overview
- Stats gradient cards: tổng bài, bình luận, danh mục, người dùng
- Chart bài viết/tháng + bình luận/tháng (12 tháng gần nhất)
- Top liked posts + top commented posts

### Posts `/dashboard/posts`
- Danh sách phân trang (10/trang)
- Search + filter
- Gán category nhanh (popover từ list)
- Featured toggle
- Publish/unpublish/delete
- Bulk actions (checkbox + action bar)
- Import/Export CSV

### Categories `/dashboard/categories`
- Drag & drop sắp xếp
- Bulk publish/unpublish/delete

### Tags `/dashboard/tags`
- Tạo/xóa tag
- Hiển thị số bài dùng tag

### Comments `/dashboard/comments`
- Duyệt/từ chối/xóa
- Bulk actions

### Users `/dashboard/users`
- Tạo, sửa, xóa tài khoản
- Đổi role, đổi mật khẩu, cập nhật avatar
- Chỉ ADMIN truy cập

### Menu `/dashboard/menu`
- Thêm/sửa/xóa mục menu
- Sắp xếp thứ tự

### Pages `/dashboard/pages`
- Quản lý trang tĩnh
- Bulk actions

### Scheduled `/dashboard/scheduled`
- Xem bài đang chờ đăng theo lịch

### Notifications `/dashboard/notifications`
- Bell icon trên header (polling 30s)
- Tự tạo notification khi có bình luận mới + bài đăng theo lịch

### Settings `/dashboard/settings`
- Tên site, tagline, logo URL
- Tracking/analytics script (nhúng vào `<head>`)
- Robots index toggle

### Về chúng tôi `/dashboard/about`
- Editor nội dung trang About (lưu vào SiteConfig)
- Thay đổi hiện trực tiếp ở trang public `/about`

### Docs/Wiki nội bộ `/dashboard/docs`
- Editor markdown cho từng key tài liệu nội bộ (model `SiteDoc`)
- Chỉ ADMIN xem được, dùng để lưu hướng dẫn vận hành

### Giao diện `/dashboard/giao-dien`
- Chỉnh text từng section trang chủ (label, title, description, background)
- Rich text editor (TipTap) cho section "Về chúng tôi"
- ADMIN + EDITOR đều truy cập được

### Liên hệ `/dashboard/lien-he`
- Thông tin cửa hàng: phone, email, địa chỉ, giờ mở cửa, Zalo
- Mạng xã hội: Facebook, Instagram, YouTube

### Đặt lịch `/dashboard/dat-lich`
- Xem/quản lý lịch đặt từ khách

---

## Trang công khai

### Trang chủ `/`
- Hero banner full-width, tagline, CTA buttons
- Featured post section riêng (badge nổi bật)
- Section divider (3 chấm + gradient line)
- Section danh mục
- Section "Về chúng tôi" (TipTap rich text hoặc fallback siteDescription)
- Section bài mới nhất
- Section booking CTA
- Tất cả text chỉnh được qua Dashboard → Giao diện

### Blog `/blog`
- Lưới 3 cột desktop
- Filter theo category (tabs) + filter theo tag (pills)
- Phân trang

### Danh mục `/categories/[slug]`
- 3 template: standard / grid / hero

### Bài viết `/posts/[postId]`
- 3 template: standard / wide / minimal
- Like, bình luận, bài liên quan carousel
- Table of contents sidebar

### Tìm kiếm `/search`
- Search theo title + tag
- Recent searches (3 cái gần nhất)
- Tag badges trên kết quả

### Tags `/tags/[slug]`
- Danh sách bài theo tag

### Về chúng tôi `/about`
### Liên hệ `/lien-he`
- Form liên hệ gửi email qua Postmark
- Thông tin cửa hàng (lấy từ DB)

### Đặt lịch `/dat-lich`
- Form đặt lịch: tên, phone, ngày, giờ, số người, món muốn đặt trước
- Multi-select món từ danh sách bài viết
- Chống spam: 1 số phone/1 ngày

---

## Profile `/profile`

- Layout 2 cột:
  - Trái: avatar + thông tin, form sửa tên/mật khẩu/avatar
  - Phải: ảnh thương hiệu + lời chào tên user + stats (số bài, thành viên từ)
- Upload avatar lên Supabase Storage

---

## UX / Loading

- **NavigationLoader**: pig 🐷 overlay full-screen khi click bất kỳ link nào, tự ẩn sau khi route thay đổi (400ms delay)
- **FunnyLoader component**: 🐷 animate-spin + 💨 animate-bounce + text random animate-pulse (dùng trong NavigationLoader và login form)
- **Login form**: hiện FunnyLoader overlay ngay khi submit, tắt nếu sai, giữ đến khi redirect nếu đúng
- **Skeleton loading**: cho tất cả trang dashboard + blog + category + post (shimmer animation)
- **NextTopLoader**: thanh progress nhỏ trên cùng (màu primary)
- **Top bar**: thông tin liên hệ + social icons (ẩn trên mobile)
- **Nav bar**: Search | Đặt lịch (bg-primary) | Đăng nhập (outline)
- **Footer 4 cột**: brand, khám phá, về chúng tôi, thông tin liên hệ

---

## UX chung

- **Dark mode**: Light / Dark / System (toggle trên header, dùng `next-themes`)
- **Vercel Analytics**: `@vercel/analytics/react` tích hợp trong root layout
- **Dynamic OG Image**: `/api/og` route tạo ảnh social card động bằng `@vercel/og` (edge runtime)

---

## SEO & Metadata

- `generateMetadata` động theo từng bài viết/danh mục
- `sitemap.xml` tự động (bài viết published + danh mục + trang tĩnh)
- `robots.txt`: block toàn bộ khi dev, bật khi go live
- Open Graph image (`/api/og`)
- `locale: "vi_VN"`, keywords tiếng Việt

---

## Storage (Supabase)

- Upload qua REST API: `POST /api/upload`
- Auth bằng Supabase service key trong header
- Extension lấy từ MIME type map (không từ filename)
- SVG bị block
- Dùng được cho: ảnh bìa bài viết, ảnh trong EditorJS, avatar user, logo

---

## Security

- Rate limiting trên API (in-memory, per IP)
- Brute force login: lock 15 phút sau 5 lần sai
- `dangerouslySetInnerHTML` qua `DOMPurify.sanitize()`
- Upload: chỉ MIME type hợp lệ, không SVG, yêu cầu login
- API: validate input bằng Zod, kiểm tra role trước mọi action
- Redirect `?from=`: chỉ accept same-origin path

---

## Database — Các model chính

| Model | Mô tả |
|---|---|
| `User` | Tài khoản, role, avatar |
| `Post` | Bài viết, EditorJS content (JSON), price, scheduledAt |
| `Category` | Danh mục, template, order |
| `Tag` / `PostTag` | Tags many-to-many |
| `Page` | Trang tĩnh, banner, SEO |
| `Comment` | Bình luận bài viết |
| `MenuItem` | Menu điều hướng |
| `SiteConfig` | Cấu hình site (JSON blob, 1 row duy nhất id="default") |
| `RefreshToken` | Refresh token (hash SHA-256) |
| `EmailToken` | Token reset password |
| `Notification` | Thông báo dashboard |
| `Booking` | Đặt lịch khách hàng |
| `SearchQuery` | Lịch sử tìm kiếm |
| `SiteDoc` | Tài liệu/wiki nội bộ (key-value, markdown) |

---

## Kỹ thuật quan trọng cần nhớ

| Vấn đề | Giải pháp |
|---|---|
| Supabase hết connection slots | Dùng pooler port 6543, `?pgbouncer=true`, `DIRECT_URL` cho migration |
| pnpm lỗi với Node 20 | Dùng `node node_modules/.bin/next dev` thay vì `pnpm dev` |
| Prisma JSON null | Dùng `Prisma.JsonNull`, không dùng JS `null` |
| TipTap StarterKit v3 | Phải `configure({ link: false, underline: false })` — v3 bundle sẵn |
| Hydration mismatch `Math.random()` | Đặt trong `useState(() => Math.random())` |
| Vercel deploy | `vercel --prod` trực tiếp (hoặc push GitHub nếu đã connect) |
| Vercel DATABASE_URL | Phải dùng Supabase pooler (có IPv4), không dùng direct host (IPv6 only) |

---

## Biến môi trường cần thiết

```
NEXT_PUBLIC_APP_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
DATABASE_URL=           ← Supabase pooler port 6543
DIRECT_URL=             ← Supabase direct port 5432 (cho prisma db push)
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
POSTMARK_API_KEY=       ← Gửi email reset password + form liên hệ
POSTMARK_FROM_EMAIL=
```
