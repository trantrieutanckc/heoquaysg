# Taxonomy — Food Blog CMS · Ghi chú dự án

## Thông tin chung

| | |
|---|---|
| **Framework** | Next.js 13 App Router |
| **Database** | PostgreSQL (Supabase) · Prisma ORM |
| **Auth** | NextAuth.js · CredentialsProvider (email + password) |
| **Deploy** | Vercel |
| **URL local** | http://localhost:3000 |
| **URL Vercel** | https://heoquaybinhtan.vercel.app |

---

## Tài khoản

| Email | Password | Role |
|---|---|---|
| admin@heoquay.com | Admin@123 | ADMIN |

---

## Cấu trúc thư mục quan trọng

```
app/
  (marketing)/        ← Trang công khai
    page.tsx           ← Trang chủ
    about/             ← Về chúng tôi
    lien-he/           ← Liên hệ (form + thông tin)
    blog/              ← Danh sách bài viết
    categories/        ← Danh sách danh mục
    categories/[slug]/ ← Trang danh mục (3 layout)
    posts/[postId]/    ← Trang bài viết (3 layout)
  (dashboard)/        ← Quản trị (yêu cầu đăng nhập)
    dashboard/         ← Danh sách bài viết
    dashboard/categories/  ← Quản lý danh mục
    dashboard/menu/    ← Quản lý menu
    dashboard/comments/ ← Quản lý bình luận
    dashboard/users/   ← Quản lý người dùng
  (editor)/           ← Soạn thảo bài viết
    editor/[postId]/
  (auth)/
    login/
api/
  posts/              ← CRUD bài viết
  posts/[postId]/     ← PATCH + DELETE bài viết
  categories/         ← CRUD danh mục
  contact/            ← Nhận form liên hệ
  upload/             ← Upload ảnh

components/
  editor.tsx          ← Editor bài viết (EditorJS)
  category-list.tsx   ← Danh sách danh mục trong dashboard
  post-item.tsx       ← Row bài viết trong dashboard
  post-category-button.tsx  ← Gán category nhanh từ dashboard
  main-nav.tsx        ← Navigation bar
  site-footer.tsx     ← Footer 4 cột

lib/
  auth.ts             ← NextAuth config (CredentialsProvider)
  session.ts          ← getCurrentUser() dùng getServerSession thật
  permissions.ts      ← Role-based: ADMIN / EDITOR / CONTRIBUTOR
  templates.ts        ← Định nghĩa template category và post
  db.ts               ← Prisma client

prisma/
  schema.prisma       ← Cấu trúc DB
  seed.js             ← Seed tài khoản admin
  seed-posts.js       ← Seed bài viết và danh mục test
```

---

## Database (Supabase)

| | |
|---|---|
| **Host direct** | db.vpdqxefnmbxklonhnlbs.supabase.co (IPv6 only — không dùng cho Vercel) |
| **Port direct** | 5432 (chỉ dùng local dev) |
| **Host pooler** | aws-1-ap-southeast-1.pooler.supabase.com (có IPv4 — dùng cho Vercel) |
| **Port pooler** | 6543 (Transaction mode) |

> **Vercel DATABASE_URL** (production): `postgresql://postgres.vpdqxefnmbxklonhnlbs:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
>
> **Lý do**: `db.xxx.supabase.co` chỉ có IPv6 → Vercel serverless không reach được. Phải dùng Supabase Supavisor pooler (`aws-1-ap-southeast-1`) có IPv4. Thêm `?pgbouncer=true` để Prisma tắt prepared statements (transaction mode không hỗ trợ).

---

## Role hệ thống

| Role | Xem dashboard | Tạo bài viết | Vào /editor | Quản lý categories/menu/users |
|---|---|---|---|---|
| ADMIN | ✅ | ✅ | ✅ | ✅ |
| EDITOR | ✅ | ✅ | ✅ | ✅ (trừ users) |
| CONTRIBUTOR | ✅ | ❌ | ❌ | ❌ |

---

## Template system

### Category templates (`/categories/[slug]`)

| Template | Mô tả |
|---|---|
| `standard` | Danh sách ngang, ảnh nhỏ bên trái |
| `grid` | Lưới 2–3 cột, nổi bật ảnh |
| `hero` | Banner ảnh lớn phía trên + lưới bài bên dưới |

### Post templates (`/posts/[postId]`)

| Template | Mô tả |
|---|---|
| `standard` | Bố cục thông thường, `max-w-3xl` |
| `wide` | Nội dung rộng hơn, `max-w-5xl` |
| `minimal` | Sạch, ẩn tác giả và category |

---

## Tính năng đã làm

### Auth & Permissions
- [x] Đăng nhập bằng email + password (bcrypt)
- [x] Middleware bảo vệ `/dashboard` và `/editor`
- [x] Chỉ ADMIN/EDITOR mới tạo được bài viết
- [x] Dashboard ẩn nút "Tạo bài" với CONTRIBUTOR
- [x] Seed tài khoản admin: `admin@heoquay.com` / `Admin@123`
- [x] Trang profile người dùng, redirect sau login theo role
- [x] Avatar user hiển thị trên nav public khi đã đăng nhập
- [x] Login page: logo HeoQuaySG, ẩn link đăng ký

### Bài viết
- [x] Tạo, sửa, xóa bài viết
- [x] Editor EditorJS (heading, list, image, table, embed, code…)
- [x] Ảnh bìa (upload hoặc URL)
- [x] SEO: title, description, keywords, og image
- [x] Template chọn layout bài viết
- [x] Gán category từ editor (toolbar)
- [x] Gán category nhanh từ dashboard list (PostCategoryButton popover)
- [x] Publish/unpublish
- [x] Like và bình luận (public)
- [x] Featured post toggle (trong dashboard)
- [x] Table of contents sidebar tự động từ headings
- [x] Full-width layout cho trang bài viết
- [x] Bài liên quan: chọn thủ công trong editor, fallback theo category
- [x] Bài liên quan carousel responsive (nhiều slide)

### Danh mục
- [x] Tạo, sửa, xóa, sắp xếp thứ tự (drag & drop)
- [x] Ảnh danh mục, SEO
- [x] Template chọn layout trang danh mục
- [x] 3 layout: standard / grid / hero

### Navigation
- [x] Menu động từ DB (dashboard → Menu)
- [x] Fallback về `marketingConfig.mainNav` nếu DB trống
- [x] Active state dùng `usePathname()` — fix bug active nhiều link cùng prefix
- [x] Nav overflow dropdown khi có quá 5 mục visible

### Pages
- [x] Trang chủ — redesign hoàn chỉnh, animations, logo, hiển thị tối đa 50 bài, featured post
- [x] Blog (danh sách bài) — lưới 3 cột trên desktop
- [x] Danh mục — cải thiện style, hero template gradient
- [x] Bài viết
- [x] Về chúng tôi (`/about`) — redesign style
- [x] Liên hệ (`/lien-he`) — form + thông tin cửa hàng
- [x] Tìm kiếm — redesign
- [x] Footer 4 cột: brand, khám phá, về chúng tôi, thông tin

### UX / Loading
- [x] Skeleton loading states cho trang blog, category, post
- [x] Skeleton loading cho toàn bộ dashboard pages: posts, categories, comments, users, menu, settings
- [x] Skeleton loading cho trang profile
- [x] Shimmer animation cho loading skeleton
- [x] Responsive layout toàn site (fix nhiều màn hình)
- [x] Đánh dấu file không dùng với comment `[UNUSED]`

### Dashboard mở rộng
- [x] Trang profile người dùng (`/profile`) — sửa thông tin, avatar
- [x] Dashboard Settings (`/dashboard/settings`) — cấu hình site: tên, tagline, logo, liên hệ, mạng xã hội, tracking code
- [x] Dashboard Menu — quản lý điều hướng
- [x] Dashboard Users — quản lý tài khoản, phân quyền, đổi mật khẩu, avatar
- [x] Rate limiting cho API

---

## Môi trường

### Local (`.env`)
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=clgshfksdhfksdhfksjdhfksjdhfksdhfksjdhf
DATABASE_URL="postgresql://postgres.vpdqxefnmbxklonhnlbs:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.vpdqxefnmbxklonhnlbs.supabase.co:5432/postgres"
```

> **Lý do dùng pooler cho local**: Supabase free tier chỉ có ~100 connection slots. Next.js hot-reload liên tục tạo Prisma client mới gây hết slot (`FATAL: remaining connection slots are reserved for SUPERUSER`). Pooler port 6543 giải quyết vấn đề này.
> 
> **DIRECT_URL** dùng để `npx prisma db push` / `prisma generate` — pooler transaction mode không hỗ trợ migration.

### Vercel (đã cấu hình)
```
NEXT_PUBLIC_APP_URL=https://heoquaybinhtan.vercel.app
NEXTAUTH_URL=https://heoquaybinhtan.vercel.app
NEXTAUTH_SECRET=<encrypted trên Vercel>
DATABASE_URL=postgresql://postgres.vpdqxefnmbxklonhnlbs:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## Chạy local

```bash
# Khởi động dev server
node node_modules/next/dist/bin/next dev

# Seed admin account
node prisma/seed.js

# Seed bài viết test
node prisma/seed-posts.js

# Đồng bộ schema DB (sau khi sửa prisma/schema.prisma)
npx prisma db push
```

---

## Việc còn lại

**Version 1 — hoàn thành 24/06/2026** ✅

**Version 2 — việc còn lại:**
- [x] **Storage thật — Supabase Storage** — `lib/supabase.ts` dùng REST API (không dùng @supabase/supabase-js tránh lỗi WebSocket Node.js 20). Upload ảnh bìa + ảnh trong EditorJS qua `/api/upload`.
- [x] **Pagination cho dashboard** — Posts (10/trang), Comments/Users/Categories (20/trang). URL `?page=N`, Prisma `skip/take`. Header hiển thị tổng record.
- [x] **Trang 404 tùy chỉnh** — `app/not-found.tsx` theo theme Heo Quay Bình Tân.
- [x] **`NEXT_PUBLIC_APP_URL` trên Vercel** — đã xóa trailing space 24/06/2026.
- [x] **Hero banner trang chủ** — hero banner full-width, tagline, CTA buttons; featured post layout riêng bên dưới
- [x] **Featured post hiển thị khác biệt** — card lớn hơn, badge nổi bật, section "Bài nổi bật" riêng
- [x] **Quản lý trang tĩnh** — model `Page` (Prisma), API CRUD, dashboard `/dashboard/pages`, route public `/pages/[slug]`; page editor có ảnh bìa, banner (tĩnh/slideshow), SEO panel
- [x] **Access token + Refresh token** — thay thế session JWT 24h:
  - Access token: JWT 30 phút (`accessTokenExpires` trong JWT)
  - Refresh token: 7 ngày, lưu hash SHA-256 trong DB (`refresh_tokens`), rotation khi access token hết hạn
  - Model `RefreshToken` (cascade xóa theo user), rotation trong JWT callback, xóa khi signOut
  - Middleware bắt `error: "RefreshTokenExpired"` → clear cookie + redirect `/login`
- [x] **Reset Password** — qua email Postmark; model `EmailToken`, `/api/auth/forgot-password`, `/api/auth/reset-password`, trang `/reset-password/[token]`
- [x] **Form liên hệ** — gửi email thật qua Postmark
- [x] **Dashboard overview v2** — tổng quan stats (gradient cards), charts bài/tháng + bình luận/tháng, top liked posts, top commented posts; danh sách bài tách ra `/dashboard/posts`
- [ ] **Dashboard chart GA4** — chart viewer GA4, chỉ test được khi go live với GA4 account thật
- ~~**API Token**~~ — đã bỏ (không có use case thực tế cho restaurant blog)

**Version 3 — hoàn thành 25/06/2026:**
- [x] **Bulk actions — Posts** — `post-list.tsx` checkbox + `BulkActionBar`; API `/api/posts/bulk` (publish/unpublish/delete)
- [x] **Bulk actions — Comments** — `comment-list.tsx` checkbox + `BulkActionBar`; API `/api/comments/bulk` (approve/reject/delete)
- [x] **Bulk actions — Categories** — `category-list.tsx` checkbox + `BulkActionBar` (tích hợp vào DnD); API `/api/categories/bulk` (publish/unpublish/delete)
- [x] **Bulk actions — Pages** — `page-list.tsx` checkbox + `BulkActionBar`; `pages/page.tsx` refactor thành server component; `page-create-button.tsx` tách dialog tạo trang
- [x] **Import / Export CSV — Posts** — xem chi tiết bên dưới
- [x] **Image lazy loading + blur placeholder** — `post-item.tsx` thêm blur; `categories/page.tsx` đổi `<img>` → `<Image>`
- [x] **Schedule publish** — field `scheduledAt` (Prisma), editor UI (Calendar + time picker), cron `/api/cron/publish` (chạy mỗi giờ), trang `/dashboard/scheduled`
- [x] **Dashboard notifications** — bell icon (polling 30s), trang `/dashboard/notifications`, tự tạo notification khi có bình luận mới + bài đăng theo lịch

## Version 4 ✅ — hoàn thành 30/06/2026
- [x] Logo thương hiệu vào header/footer — đã có từ trước, lấy từ Dashboard → Settings → logoUrl
- [x] Go live checklist — sitemap, metadata đã xong; robots index bật qua dashboard khi go live (bên dưới)

## Version 5 — hoàn thành 01/07/2026

- [x] **Chỉnh text trang chủ qua dashboard Giao diện** — `homepage-appearance-form.tsx` đã có sẵn text fields (label/title) + background cho từng section; wire `page.tsx` truyền cfg xuống; `home-sections.tsx` (`LatestPostsSection`, `BookingCtaSection`, `AboutSection`) nhận props thay vì hardcode text
- [x] **Fix duplicate heading** — xóa h1 thừa bên trong `homepage-appearance-form.tsx` (trùng với `DashboardHeader`); xóa nút Lưu thừa ở đầu form
- [x] **Tags bài viết** — model `Tag` + `PostTag` (many-to-many) trong Prisma; API `/api/tags` (GET/POST) + `/api/tags/[tagId]` (DELETE, ADMIN only); `TagSelector` popover trong editor (toggle + tạo mới inline); `EditorTagSection` accordion; filter `/blog?tag=slug` (pill dưới category tabs); trang public `/tags/[slug]`; dashboard `/dashboard/tags`
- [x] **Search theo tags** — OR query tìm theo title OR tag name; hiển thị tag badges trên kết quả tìm kiếm
- [x] **Lưu lịch sử tìm kiếm** — model `SearchQuery`; API `/api/search/log` (POST log ≥3 ký tự, GET 3 recent deduped); component `RecentSearches`; hiện 3 tìm kiếm gần nhất khi chưa có query
- [x] **TipTap rich text editor trong Giao diện** — `MiniTiptapEditor` (StarterKit.configure({link:false,underline:false}), Underline, Link, Placeholder); toolbar Bold/Italic/Underline/BulletList/OrderedList/Link/ClearFormat; `lib/tiptap-html.ts` render server-side; `AboutSection` fallback về `siteDescription` nếu chưa có content
- [x] **EDITOR role vào được trang Giao diện** — `dashboard/giao-dien/page.tsx` + `api/site-config` PUT cho phép ADMIN hoặc EDITOR
- [x] **Xóa duplicate contact/social trong Settings** — giữ ở trang Liên hệ, bỏ khỏi `site-config-form.tsx`
- [x] **Nút Đặt lịch trên nav bar** — xóa floating button cũ (fixed bottom-right), thêm vào nav giữa Search và Đăng nhập (`bg-primary`, uppercase, tracking-wider); đổi login button thành `variant="outline"`
- [x] **FunnyLoader** — `components/funny-loader.tsx` (🐷 animate-spin + 💨 animate-bounce + text random animate-pulse); dùng "use client" + `useState(() => Math.random())` tránh hydration mismatch
- [x] **Full-screen navigation loader** — `NavigationLoader` overlay (click link → hiện, pathname thay đổi → ẩn sau 400ms); mount trong root layout; dùng lại `FunnyLoader`
- [x] **FunnyLoader khi đăng nhập** — hiện full-screen overlay ngay khi submit form (thay spinner button cũ); tắt nếu sai mật khẩu, giữ đến khi redirect nếu thành công
- [x] **Loading 2 tầng** — `NavigationLoader` pig overlay full-screen khi click link; skeleton `loading.tsx` gốc restore lại cho body streaming (không dùng FunnyLoader trong loading.tsx nữa để tránh double loading)

- [x] **Profile page 2 cột** — trái: avatar + info + form chỉnh thông tin; phải: ảnh heo quay Unsplash + lời chào tên user + stats (số bài viết, thành viên từ) + message nhỏ; cột phải sticky trên desktop

## Version 6 ✅ — hoàn thành 01/07/2026

- [x] **Thực đơn / Bảng giá** — model `DishGroup` + `Dish` (Prisma); API CRUD `/api/dish-groups`, `/api/dish-groups/[groupId]`, `/api/dishes`, `/api/dishes/[dishId]`; dashboard `/dashboard/thuc-don` (thêm/sửa/xóa nhóm + món, toggle có sẵn/hết); trang public `/thuc-don` (hero banner, sticky category nav, dish list theo nhóm, CTA đặt lịch + số điện thoại từ Settings)
- [x] **Block T7/CN trong form đặt lịch** — `nextWeekday()` thay `tomorrow()` (tự nhảy qua weekend); validate khi user chọn ngày; hint text "Giao hàng Thứ 2 – Thứ 6"

## Version 7 ✅ — hoàn thành 03/07/2026

- [x] **Newsletter** — model `Subscriber` (email, name, token, active, subscribedAt, unsubscribedAt); `components/newsletter-form.tsx` nhúng trong footer; API `/api/newsletter/subscribe` (POST, reactivate nếu đã hủy) + `/api/newsletter/unsubscribe` (GET via token) + `/api/newsletter/subscribers` (GET, ADMIN/EDITOR) + `/api/newsletter/subscribers/[id]` (DELETE) + `/api/newsletter/export` (CSV); dashboard `/dashboard/subscribers` (filter active/inactive/all, export CSV, hủy đăng ký)

## Content — 03/07/2026

- 6 bài blog đầy đủ nội dung + SEO (TipTap JSON format), seed qua `prisma/seed-posts-v2.js`:
  - Heo Quay Lá Mắc Mật — Đặc Sản Giao Thoa Hai Miền (Món Quay, wide)
  - Gà Quay Mật Ong — Da Giòn, Thịt Ngọt, Không Bở (Công Thức, standard)
  - Tại Sao Da Heo Quay Không Giòn? 7 Lỗi Thường Gặp (Mẹo Nấu Ăn, standard)
  - Đặt Heo Quay Cúng Giỗ — Những Điều Cần Biết (Món Quay, minimal)
  - Bảo Quản Heo Quay — Giữ Da Giòn Cả Ngày Không Lo (Mẹo Nấu Ăn, standard)
  - Heo Quay Bình Tân — Câu Chuyện Từ Bếp Lửa Gia Đình (Món Quay, wide)

---

## Khi go live cần làm thêm

### Code ✅ (đã xong)
- [x] robots index, sitemap, metadata, thực đơn nav
- [x] Số điện thoại `0987 054 231` đã lưu DB (13/07/2026)
- [x] Đổi tên project từ taxonomy → heoquaybinhtan toàn bộ codebase

### Chờ khách chọn domain `heoquaybinhtan.com` hoặc `.vn`

### Checklist khi có domain (làm theo thứ tự)

**Bước 1 — Vercel Dashboard**
- [ ] Settings → General → Project Name → đổi thành `heoquaybinhtan`
- [ ] Settings → Domains → thêm domain mới
- [ ] Settings → Environment Variables → cập nhật:
  - `NEXT_PUBLIC_APP_URL` = `https://heoquaybinhtan.com` (hoặc .vn)
  - `NEXTAUTH_URL` = `https://heoquaybinhtan.com` (hoặc .vn)
- [ ] Redeploy

**Bước 2 — DNS (tại nơi mua domain)**
- [ ] Copy A record / CNAME từ Vercel → dán vào DNS

**Bước 3 — Dashboard site**
- [ ] Settings → Tên site → điền "Heo Quay Bình Tân"
- [ ] Settings → Phân tích & SEO → bật robots index

**Bước 4 — Test**
- [ ] Mở domain, kiểm tra load
- [ ] Đặt lịch thử → nhận email
- [ ] Form liên hệ → nhận email

---

## Thay đổi gần đây

### 25/06/2026 — Import / Export CSV bài viết (V3)

#### Tính năng
Ba nút xuất hiện ở góc phải header trang `/dashboard/posts`:
- **Export CSV** — tải toàn bộ bài viết của user hiện tại ra file `.csv`
- **Import CSV** — upload file CSV để tạo hàng loạt bài viết nháp
- **Mẫu** — tải file `import-template.csv` mẫu để điền

#### Export

Endpoint: `GET /api/posts/export`  
Yêu cầu: đăng nhập (bất kỳ role nào)

File trả về: `posts-YYYY-MM-DD.csv`

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | string | ID bài viết |
| `title` | string | Tiêu đề |
| `published` | true/false | Trạng thái đăng |
| `featured` | true/false | Bài nổi bật |
| `price` | number | Giá (VND), để trống nếu không có |
| `categories` | string | Tên danh mục, nhiều danh mục ngăn cách bằng `\|` |
| `likes` | number | Số lượt thích |
| `createdAt` | ISO 8601 | Ngày tạo |

#### Import

Endpoint: `POST /api/posts/import` (multipart form, field `file`)  
Yêu cầu: role EDITOR hoặc ADMIN

File CSV phải có header dòng đầu tiên. Các cột được hỗ trợ:

| Cột | Bắt buộc | Mô tả |
|---|---|---|
| `title` | ✅ | Tiêu đề bài viết |
| `price` | | Giá (số, đơn vị VND) |
| `categories` | | Tên danh mục, nhiều danh mục ngăn cách bằng `\|` — **phải tồn tại trong DB** |

Tất cả bài được tạo ở trạng thái **nháp** (`published = false`). Nội dung bài trống, user tự vào editor để soạn.

**Ví dụ file import:**
```csv
title,price,categories
"Heo Quay Lá Mắc Mật",250000,"Món Quay|Đặc Sản"
"Vịt Quay Bắc Kinh",320000,"Vịt Quay"
"Gà Quay Mật Ong",180000,""
```

**Response:**
```json
{ "created": 3, "errors": [] }
```

Nếu có lỗi ở một số dòng, các dòng hợp lệ vẫn được tạo. Lỗi được báo theo số dòng trong file (dòng 2 = dòng dữ liệu đầu tiên).

#### Files liên quan
- `app/api/posts/export/route.ts` — GET handler
- `app/api/posts/import/route.ts` — POST handler + CSV parser
- `components/posts-import-export.tsx` — UI buttons (Export, Import, Mẫu)
- `app/(dashboard)/dashboard/posts/page.tsx` — mount component vào header

---

### 25/06/2026 — UI improvements homepage (V3)
- `app/(marketing)/page.tsx`: Hero CTA buttons to lên (`px-10 py-4 text-base`), thêm icon mũi tên và điện thoại
- `app/(marketing)/page.tsx`: Thêm `SectionDivider` (3 chấm cam + gradient line) giữa các section: Featured → Categories → Về chúng tôi → Bài viết mới nhất
- `app/(marketing)/blog/page.tsx`: Category filter pills (URL-based: `/blog?category=slug`), đếm bài theo category, active state highlight

### 25/06/2026 — Bulk actions categories + pages (V3)
- `api/categories/bulk/route.ts`: thêm action `publish` + `unpublish`
- `components/category-list.tsx`: checkbox + BulkActionBar tích hợp vào DnD (`stopPropagation` để không conflict)
- `components/page-list.tsx` (NEW): list pages với checkbox + BulkActionBar
- `components/page-create-button.tsx` (NEW): dialog tạo trang, tách ra khỏi page.tsx
- `app/(dashboard)/dashboard/pages/page.tsx`: refactor thành server component, fetch DB trực tiếp (nhất quán với categories)

### 25/06/2026 — Access/refresh token + Page SEO/banner + Dashboard v2 (commit 1cffe73)
- `lib/auth.ts` + `middleware.ts` + `schema`: access token 30 phút, refresh token 7 ngày (hash SHA-256, rotation tự động, middleware clear cookie khi expired)
- `page-editor.tsx` + `api/pages/[pageId]`: thêm ảnh bìa, banner (tĩnh/slideshow tối đa 10 slide), SEO panel cho trang tĩnh; schema `Page` thêm `image/seo*/banner`
- `dashboard/page.tsx` + `dashboard-overview.tsx`: stats gradient cards, top liked/commented posts, chart labels vi
- `dashboard/posts/`: tách danh sách bài ra route riêng `/dashboard/posts` (PAGE_SIZE=6)
- `config/dashboard.ts`: labels tiếng Việt, thêm item Dashboard + Bài viết

### 24/06/2026 — Security fixes + bug fixes (post Version 1)

#### Security fixes
- `api/users/route.ts`: GET + POST yêu cầu session ADMIN
- `api/users/[userId]/route.ts`: PATCH yêu cầu auth; chỉ ADMIN đổi được role; user chỉ sửa được chính mình
- `api/posts/[postId]/route.ts`: PATCH + DELETE yêu cầu ADMIN/EDITOR; EDITOR chỉ sửa/xóa bài của mình
- `api/upload/route.ts`: thêm auth; extension lấy từ MIME type map (không từ filename); bỏ SVG
- `api/comments/[commentId]/route.ts`: DELETE yêu cầu ADMIN hoặc EDITOR
- `api/categories/route.ts`: POST yêu cầu ADMIN hoặc EDITOR
- `api/posts/[postId]/featured/route.ts`: thêm auth + validate `featured` bằng Zod + dùng `$transaction`
- `components/editorjs-renderer.tsx`: wrap tất cả `dangerouslySetInnerHTML` qua `DOMPurify.sanitize()` (cài `isomorphic-dompurify`)
- `lib/rate-limit.ts`: fix off-by-one — block ngay từ lần thứ 5 thay vì lần thứ 6
- `components/user-auth-form.tsx`: validate `from` chỉ accept path cùng origin, reject URL ngoài

#### Bug fixes
- `api/posts/route.ts`: GET giới hạn `take: 200`
- `api/site-config/route.ts`: PUT bọc try/catch + validate body là object
- `lib/auth.ts`: JWT callback không còn query DB mỗi request — chỉ query khi token cũ chưa có `role`
- `components/comment-section.tsx`: fetch comments có error handling + reset name/email/content sau submit
- `components/editor.tsx`: dùng `initialPostRef` để editor không reinit khi parent re-render; bọc `onSubmit` trong try/finally để `isSaving` luôn được reset
- `prisma/schema.prisma`: thêm `@@index([authorId])` và `@@index([published, updatedAt])` cho bảng `posts`

### 24/06/2026 — Version 1 hoàn thành
- Skeleton loading cho tất cả dashboard pages (categories, comments, users, menu, settings, profile)
- Fix `TypeError: Invalid URL` trên Vercel: thêm `.trim()` + try-catch quanh `new URL()` trong `generateMetadata` của blog/docs/guides
- Fix Prisma cold start trên Vercel: dùng `global.cachedPrisma` cho cả production, `connection_limit=1`

### 23/06/2026 — Fix lỗi hết connection slots Supabase
- **Vấn đề**: `FATAL: remaining connection slots are reserved for SUPERUSER` — Supabase free tier hết 100 connection slots do Next.js hot-reload tạo nhiều Prisma client.
- **Fix**:
  - `.env`: đổi `DATABASE_URL` sang pooler `port 6543` với `?pgbouncer=true`, thêm `DIRECT_URL` giữ nguyên direct `port 5432`
  - `prisma/schema.prisma`: thêm `directUrl = env("DIRECT_URL")` để migration vẫn dùng direct connection
- **Lưu ý**: Nếu lỗi tái diễn, vào Supabase Dashboard → SQL Editor → chạy `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'postgres' AND pid <> pg_backend_pid() AND state IN ('idle', 'idle in transaction');`. Nếu SQL Editor cũng không vào được → pause rồi resume project.

---

### 13/07/2026 — Pre-demo cleanup & go-live prep

#### Đã làm
- **Fix heoquaybinhtan.vercel.app**: project đổi tên trên Vercel nhưng alias chưa đổi → `vercel alias set` + `vercel domains add heoquaybinhtan.vercel.app`
- **Deploy workflow**: xác nhận GitHub đã connect Vercel → chỉ cần `git push`, KHÔNG dùng `vercel --prod`
- **sanitize-html ESM fix**: v2.17.6 build lỗi webpack → thêm `"sanitize-html"` vào `serverComponentsExternalPackages` trong `next.config.mjs`
- **Bỏ italic toàn site**: Nunito không đẹp italic → xóa tất cả class `italic` trong `home-sections.tsx`
- **seoDescription hiển thị**: thêm dưới tiêu đề ở trang category, blog, homepage
- **Điền content 21 bài trống**: dùng Prisma script viết TipTap JSON trực tiếp vào DB
- **Dọn post library**: publish 14 bài liên quan, xóa 8 bài không liên quan, đổi "Heo Quay 47" → "Heo Quay Bình Tân"
- **Button arrow animation**: `group-hover:translate-x-1.5` trên tất cả icon arrow
- **Tab filter homepage**: component `LatestPostsTabs` (client) — Tất cả / Heo Quay / Vịt Quay / Gà Quay, filter client-side không reload trang
- **Dashboard overview**: thêm stat card "Đặt lịch" (tổng + pending), card link thẳng `/dashboard/dat-lich`, viền đỏ khi có đơn chờ
- **Cron keep-alive**: `app/api/cron/ping/route.ts` + schedule `0 */12 * * *` trong `vercel.json` → giữ Supabase không bị pause (free tier pause sau 7 ngày inactive)
- **About section ẩn khi trống**: homepage chỉ render AboutSection khi có `contactAddress` / `contactPhone` / `aboutContentHtml`

#### Cần làm trước go-live
- [ ] Dashboard → Cài đặt: **bật toggle "Cho phép Google index"** (`robotsIndex = true`)
- [ ] Dashboard → Liên hệ: điền SĐT thật, địa chỉ, giờ mở cửa, Facebook page
- [ ] Dashboard → Cài đặt: thêm URL sitemap vào robots.txt: `Sitemap: https://heoquaybinhtan.vercel.app/sitemap.xml`
- [ ] Đổi ảnh thumbnail các bài dùng stock photo không liên quan (thịt bò, gà chiên)
- [ ] Kiểm tra `CRON_SECRET` đã set trong Vercel env vars (bảo vệ route `/api/cron/*`)
- [ ] Nếu Supabase project bị pause trước demo → vào site 1-2 tiếng trước để wake up
