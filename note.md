# Heo Quay Bình Tân — Danh sách chức năng

## Tổng quan
CMS + thương mại điện tử cho cửa hàng heo quay/gà quay/vịt quay.
Stack: Next.js 13 (App Router), Prisma, MySQL, TailwindCSS, TipTap, NextAuth, Postmark.
Deploy: GitHub Actions → SSH → PM2 trên server.ithelpdesksaigon.com

---

## Trang Public

| Trang | URL | Mô tả |
|-------|-----|-------|
| Trang chủ | `/` | Hero, bài nổi bật, danh mục, thực đơn, booking CTA, map |
| Blog | `/blog`, `/blog/[page]` | Danh sách bài viết phân trang |
| Chi tiết bài viết | `/posts/[postId]` | Bài viết, bình luận, rating sao, like, share, related posts |
| Danh mục | `/categories`, `/categories/[slug]` | 3 template: list / grid / hero |
| Tags | `/tags/[slug]` | Bài viết theo thẻ |
| Tìm kiếm | `/search?q=...` | Tìm bài viết & tags, lưu query |
| Thực đơn | `/thuc-don` | Hiển thị món ăn theo DishGroup |
| Đặt lịch | `/dat-lich` | Form đặt hàng giao tận nơi (anti-bot, rate limit) |
| Liên hệ | `/lien-he` | Form liên hệ, gửi email thông báo |
| Trang tĩnh | `/pages/[slug]` | Trang do admin tạo (about, privacy, terms...) |

---

## Authentication

| Trang | URL |
|-------|-----|
| Đăng nhập | `/login` — rate limit 10 lần/15 phút |
| Đăng ký | `/register` — role CONTRIBUTOR mặc định |
| Quên mật khẩu | `/forgot-password` — gửi token qua email |
| Reset mật khẩu | `/reset-password/[token]` |
| Hồ sơ cá nhân | `/profile` |

---

## Dashboard / CMS (cần đăng nhập)

### Bài viết
- `/dashboard/posts` — CRUD, filter published/draft, bulk actions, export CSV
- `/dashboard/scheduled` — lập lịch xuất bản tự động
- `/editor/[postId]` — TipTap editor: text, heading, image, table, code, link, color

### Nội dung
- `/dashboard/categories` — CRUD danh mục (tên, slug, ảnh, SEO, template)
- `/dashboard/tags` — CRUD thẻ (slugify tự động)
- `/dashboard/pages` — CRUD trang tĩnh (TipTap + SEO)
- `/dashboard/about` — Chỉnh nội dung About bằng TipTap
- `/dashboard/comments` — Duyệt/xóa bình luận, xem rating sao
- `/dashboard/docs` — Tài liệu nội bộ (key-value)

### Thực đơn & Đặt lịch
- `/dashboard/thuc-don` — CRUD DishGroup + Dish (tên, mô tả, unit, ảnh, available)
- `/dashboard/dat-lich` — Xem booking, filter status, export CSV
- `/dashboard/lien-he` — Xem contact message

### Hệ thống (ADMIN)
- `/dashboard/users` — CRUD user (ADMIN / EDITOR / CONTRIBUTOR)
- `/dashboard/subscribers` — Newsletter subscribers, export CSV
- `/dashboard/notifications` — Thông báo hệ thống
- `/dashboard/menu` — Quản lý menu navigation
- `/dashboard/giao-dien` — Tuỳ chỉnh giao diện homepage (text, color, ảnh nền)
- `/dashboard/settings` — Cài đặt site (tên, logo, contact, social, GA4)
- `/dashboard/import-export` — Import/export CSV
- `/dashboard/ip-block` — Block IP spam, xem request log

---

## API Routes

### Bài viết
- `GET/POST /api/posts`
- `GET/PATCH/DELETE /api/posts/[postId]`
- `PATCH /api/posts/[postId]/featured` — chỉ 1 bài featured tại 1 lúc
- `POST /api/posts/[postId]/like` — rate limit 5/giờ/IP
- `GET /api/posts/[postId]/comments`
- `POST /api/posts/import` / `GET /api/posts/export`
- `PATCH/DELETE /api/posts/bulk`

### Bình luận
- `PATCH/DELETE /api/comments/[commentId]` — duyệt/xóa, tự tính lại rating
- `PATCH/DELETE /api/comments/bulk`

### Danh mục, Tags, Pages, Menu
- CRUD chuẩn + bulk operations cho từng resource

### Booking
- `POST /api/bookings` — anti-bot (5s min fill time), rate limit 1/phone/10 phút
- `GET/PATCH/DELETE /api/bookings/[id]`
- `GET /api/bookings/export`

### Thực đơn
- CRUD `/api/dishes`, `/api/dish-groups`
- Import/export CSV

### Newsletter
- `POST /api/newsletter/subscribe` / `unsubscribe`
- `GET /api/newsletter/subscribers` + export CSV

### Liên hệ
- `POST /api/contact` — rate limit 3/giờ, gửi email Postmark

### Upload & Images
- `POST /api/upload` — MIME validation (jpg, png, webp, gif, svg)
- `GET /api/images/[...path]` — serve ảnh có caching

### Cron & Health
- `GET /api/cron/publish` — auto publish scheduled posts (cần CRON_SECRET)
- `GET /api/cron/ping` — health check

### Khác
- `GET /api/analytics` — Google Analytics 4 data (admin only)
- `GET /api/og` — generate OG image động
- `GET/POST/DELETE /api/dashboard/ip-block`
- `POST/GET /api/search/log`
- `GET/PUT /api/site-config`
- `GET /api/notifications` + read-all

---

## Tích hợp bên ngoài

| Service | Mục đích |
|---------|---------|
| Postmark | Email transactional (booking, reset pass, contact, comment) |
| Google Analytics 4 | Traffic + analytics dashboard |
| MySQL + Prisma | Database |
| NextAuth.js | Auth (credentials, session, refresh token 7 ngày) |
| Vercel OG | Dynamic OG image |
| Vercel Analytics | Performance tracking |

---

## Database Models (Prisma)

```
User (ADMIN / EDITOR / CONTRIBUTOR)
Post (Category nhiều-nhiều, Tag nhiều-nhiều, Comment, Dish)
Category → MenuItem
Comment (approval, rating 1-5 sao, IP)
Booking (pending → confirmed → done / cancelled)
Tag, Page, SiteConfig, SiteDoc
Dish, DishGroup
BlockedIp, RequestLog, SearchQuery
Subscriber (newsletter)
RefreshToken, Account (OAuth)
```

---

## Bảo mật
- Login rate limit: 10 lần / 15 phút
- Booking rate limit: 1 lần / số phone / 10 phút
- Contact rate limit: 3 lần / giờ
- Anti-bot booking: form phải điền ≥ 5 giây
- IP blocking + request logging
- Access token TTL: 30 phút
- Refresh token TTL: 7 ngày

---

## SEO
- Metadata động per page/post/category
- Open Graph (ảnh động)
- Twitter card
- JSON-LD FoodEstablishment schema
- Sitemap tự động
- robots.txt

---

## Deploy
```
push GitHub → GitHub Actions build → SCP upload .next lên server
→ SSH: npm install → chmod +x start.sh → pm2 restart (nếu đang chạy) hoặc pm2 start ecosystem.config.js
```

**ecosystem.config.js**: fork mode, script `start.sh`, port 3000, restart_delay 3s, kill_timeout 10s, max_memory 500MB

---

## Server stability — vấn đề thường gặp & cách xử lý

### ⚠️ BUG SSS — Root cause site down mỗi 5 phút (đã fix 05/08/2026)

**Triệu chứng:** Site down đều đặn mỗi ~5 phút, không có lỗi rõ ràng trong log, PM2 tự restart liên tục.

**Root cause:** Trong crontab có dòng:
```
*/5 * * * * pkill -f "jest-worker/processChild.js" 2>/dev/null; true
```
Dòng này được thêm vào với mục đích "kill zombie jest-worker để tránh memory leak", nhưng **`jest-worker/processChild.js` chính là worker process của Next.js production** — không phải Jest test runner.  
→ Mỗi 5 phút, crontab tự kill toàn bộ worker render của Next.js → site crash silent, PM2 restart, lại bị kill sau 5 phút tiếp.

**Fix:** Xóa dòng đó khỏi crontab. **Không bao giờ thêm lại.**

---

### Crontab hiện tại (đã dọn sạch)

```
0 2 * * * curl -sf -H "Authorization: Bearer ea1c9563596bbf20aabe2c266c654b07f0" https://heoquaybinhtan.com/api/cron/publish
@reboot sleep 30 && pm2 start /home/heoquaybinhtan/app/ecosystem.config.js --update-env && pm2 save
```

- `0 2 *`: auto publish bài lên lịch lúc 2:00 sáng
- `@reboot`: tự start sau khi server reboot

---

### Triệu chứng: Site down, curl localhost:3000 không phản hồi

**Nguyên nhân phổ biến:** `EADDRINUSE` — zombie process giữ port 3000.  
Lỗi nằm trong **error log**: `~/.pm2/logs/heoquaybinhtan-error-0.log`  
PM2 vẫn hiện `online` dù thực ra app fail.

**3 bước khi bị down:**

**Bước 1** — Xem lỗi:
```bash
pm2 logs heoquaybinhtan --err --lines 20 --nostream
```

**Bước 2** — Kill sạch và restart:
```bash
pm2 kill 2>/dev/null; pkill -f "node.*next" 2>/dev/null; sleep 3; fuser -k 3000/tcp 2>/dev/null; sleep 2; pm2 start /home/heoquaybinhtan/app/ecosystem.config.js --update-env && pm2 save
```

**Bước 3** — Xác nhận:
```bash
pm2 status && curl -I http://localhost:3000
```
Chờ ~20 giây. Thấy `HTTP/1.1 200 OK` là ổn.

---

### Lưu ý quan trọng

- **Không có sudo** → không dùng được `pm2 startup` (systemd)
- **start.sh** tự kill zombie + clear port 3000 mỗi lần PM2 start/restart — không cần làm thủ công
- **Error log:** `~/.pm2/logs/heoquaybinhtan-error-0.log`
- **Deploy:** dùng `pm2 restart heoquaybinhtan --update-env` để ít downtime hơn; chỉ `pm2 kill` + `pm2 start` khi lần đầu hoặc process bị lỗi nặng
