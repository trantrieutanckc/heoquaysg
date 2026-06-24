# Taxonomy — Food Blog CMS · Ghi chú dự án

## Thông tin chung

| | |
|---|---|
| **Framework** | Next.js 13 App Router |
| **Database** | PostgreSQL (Supabase) · Prisma ORM |
| **Auth** | NextAuth.js · CredentialsProvider (email + password) |
| **Deploy** | Vercel |
| **URL local** | http://localhost:3000 |
| **URL Vercel** | https://taxonomy-ebon.vercel.app |

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
NEXT_PUBLIC_APP_URL=https://taxonomy-ebon.vercel.app
NEXTAUTH_URL=https://taxonomy-ebon.vercel.app
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
- [ ] **Storage thật (Cloudinary / Supabase Storage)** — hiện `api/upload/route.ts` lưu vào `public/uploads/` (không tồn tại lâu trên Vercel). Khi fix xong thì 2 tính năng sau sẽ hoạt động tự động:
  - Upload ảnh bìa bài viết (cover image)
  - Upload ảnh trực tiếp vào nội dung bài (EditorJS image tool đã wire sẵn, chỉ cần đổi backend `api/upload`)
- [ ] **Quản lý trang tĩnh** — admin tự tạo page mới (ví dụ `/gioi-thieu`, `/chinh-sach`, `/faq`) trong dashboard mà không cần code. Cần: model `Page` (Prisma), API CRUD, dashboard `/dashboard/pages`, page editor, route public `/pages/[slug]`
- [ ] **Access token + Refresh token** — thay thế session JWT 24h hiện tại bằng hệ thống 2 token an toàn hơn:
  - **Access token**: JWT ngắn hạn (15 phút), lưu trong cookie `HttpOnly SameSite=Strict`
  - **Refresh token**: random token dài hạn (7 ngày), lưu **hash** trong DB (model `RefreshToken`), dùng để cấp access token mới
  - **Token rotation**: mỗi lần refresh → cấp refresh token mới + vô hiệu hóa cái cũ → nếu bị đánh cắp, user hợp lệ refresh sẽ fail và biết ngay
  - **Revoke**: logout hoặc admin có thể thu hồi refresh token bất cứ lúc nào
  - Cần: model `RefreshToken` (id, userId, tokenHash, expiresAt, revokedAt, userAgent, ip, createdAt), `POST /api/auth/refresh`, cập nhật middleware, auto-refresh client-side trước khi access token hết hạn
  - Lưu ý: đây là thay đổi lớn, cần thay thế toàn bộ NextAuth session strategy hiện tại
- [ ] **API Token** — user tự tạo personal access token để gọi API bằng `Authorization: Bearer <token>` thay cho session. Cần:
  - Model `ApiToken` (id, userId, name, tokenHash, lastUsedAt, expiresAt?, createdAt)
  - Trang quản lý token trong profile hoặc dashboard
  - Middleware/helper check Bearer header song song với session hiện tại
- [ ] **Reset Password / Email Token** — đổi mật khẩu qua email. Cần:
  - Model `EmailToken` (id, email, tokenHash, type: RESET_PASSWORD | VERIFY_EMAIL, expiresAt, usedAt?)
  - API route `POST /api/auth/forgot-password` — gửi link reset
  - API route `POST /api/auth/reset-password` — xác nhận token + đổi mật khẩu
  - Trang `/reset-password/[token]`
  - SMTP/Resend (dùng chung với task form liên hệ bên dưới)
- [ ] **Form liên hệ** — chưa gửi email thật, cần cấu hình SMTP/Resend
- [ ] **`NEXT_PUBLIC_APP_URL` trên Vercel** — xóa trailing space (gây lỗi `Invalid URL` cho OG image)

---

## Thay đổi gần đây

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
