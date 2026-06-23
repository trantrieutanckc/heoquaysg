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

### Danh mục
- [x] Tạo, sửa, xóa, sắp xếp thứ tự (drag & drop)
- [x] Ảnh danh mục, SEO
- [x] Template chọn layout trang danh mục
- [x] 3 layout: standard / grid / hero

### Navigation
- [x] Menu động từ DB (dashboard → Menu)
- [x] Fallback về `marketingConfig.mainNav` nếu DB trống
- [x] Active state dùng `usePathname()` — fix bug active nhiều link cùng prefix

### Pages
- [x] Trang chủ
- [x] Blog (danh sách bài)
- [x] Danh mục
- [x] Bài viết
- [x] Về chúng tôi (`/about`)
- [x] Liên hệ (`/lien-he`) — form + thông tin cửa hàng
- [x] Tìm kiếm
- [x] Footer 4 cột: brand, khám phá, về chúng tôi, thông tin

---

## Môi trường

### Local (`.env`)
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=clgshfksdhfksdhfksjdhfksjdhfksdhfksjdhf
DATABASE_URL="postgresql://postgres:...@db...supabase.co:5432/postgres"
```

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

- [x] Fix DATABASE_URL trên Vercel → dùng Supabase Supavisor pooler `aws-1-ap-southeast-1` với `?pgbouncer=true` (login production đã hoạt động)
- [ ] Trang chủ vẫn đang dùng nội dung mặc định của Taxonomy — cần redesign
- [ ] Upload ảnh cần cấu hình storage (hiện tại dùng base64 hoặc URL ngoài)
- [ ] Form liên hệ chưa gửi email thật (chỉ log ra console) — cần cấu hình SMTP/Resend
