const POSTMARK_TOKEN = process.env.POSTMARK_API_TOKEN
const FROM = process.env.SMTP_FROM ?? "noreply@example.com"
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL

interface CommentNotifyPayload {
  postId: string
  postTitle: string
  authorName: string
  authorEmail?: string | null
  content: string
  siteUrl: string
}

export async function sendCommentNotification(data: CommentNotifyPayload) {
  if (!POSTMARK_TOKEN || !NOTIFY_EMAIL) return // not configured — silent skip

  const dashboardUrl = `${data.siteUrl}/dashboard/comments?status=pending`
  const postUrl = `${data.siteUrl}/posts/${data.postId}`

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;max-width:560px;">

        <!-- Header -->
        <tr>
          <td style="background:#f97316;padding:20px 32px;">
            <p style="margin:0;color:#fff;font-size:18px;font-weight:700;">💬 Bình luận mới đang chờ duyệt</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 6px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Bài viết</p>
            <p style="margin:0 0 20px;font-size:15px;font-weight:600;color:#111827;">
              <a href="${postUrl}" style="color:#f97316;text-decoration:none;">${escapeHtmlMin(data.postTitle)}</a>
            </p>

            <p style="margin:0 0 6px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Tác giả</p>
            <p style="margin:0 0 20px;font-size:15px;color:#111827;">
              ${escapeHtmlMin(data.authorName)}${data.authorEmail ? ` &lt;${escapeHtmlMin(data.authorEmail)}&gt;` : ""}
            </p>

            <p style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Nội dung</p>
            <blockquote style="margin:0 0 24px;padding:14px 16px;background:#f9fafb;border-left:3px solid #f97316;border-radius:0 8px 8px 0;">
              <p style="margin:0;font-size:14px;color:#374151;white-space:pre-wrap;word-break:break-word;">${escapeHtmlMin(data.content.slice(0, 500))}${data.content.length > 500 ? "..." : ""}</p>
            </blockquote>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:12px;">
                  <a href="${dashboardUrl}" style="display:inline-block;background:#f97316;color:#fff;font-size:14px;font-weight:600;padding:10px 22px;border-radius:8px;text-decoration:none;">
                    Duyệt ngay →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #f3f4f6;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              Email này được gửi tự động từ hệ thống CMS. Đừng trả lời email này.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  try {
    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": POSTMARK_TOKEN,
      },
      body: JSON.stringify({
        From: FROM,
        To: NOTIFY_EMAIL,
        Subject: `💬 Bình luận mới chờ duyệt — ${data.postTitle}`,
        HtmlBody: html,
        TextBody: `Bình luận mới từ ${data.authorName}:\n\n${data.content}\n\nDuyệt tại: ${dashboardUrl}`,
        MessageStream: "outbound",
      }),
    })
  } catch {
    // Non-critical — don't let email failure break the comment submission
  }
}

// ── Contact form notification ─────────────────────────────────────────────────

interface ContactPayload {
  name: string
  email?: string
  phone?: string
  message: string
}

export async function sendContactEmail(data: ContactPayload) {
  if (!POSTMARK_TOKEN || !NOTIFY_EMAIL) return

  const html = `
<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;max-width:560px;overflow:hidden;">
        <tr><td style="background:#f97316;padding:20px 32px;">
          <p style="margin:0;color:#fff;font-size:18px;font-weight:700;">📩 Tin nhắn liên hệ mới</p>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <p style="margin:0 0 6px;font-size:13px;color:#6b7280;text-transform:uppercase;">Tên</p>
          <p style="margin:0 0 20px;font-size:15px;font-weight:600;color:#111827;">${escapeHtmlMin(data.name)}</p>
          ${data.email ? `<p style="margin:0 0 6px;font-size:13px;color:#6b7280;text-transform:uppercase;">Email</p>
          <p style="margin:0 0 20px;font-size:15px;color:#111827;">${escapeHtmlMin(data.email)}</p>` : ""}
          ${data.phone ? `<p style="margin:0 0 6px;font-size:13px;color:#6b7280;text-transform:uppercase;">Điện thoại</p>
          <p style="margin:0 0 20px;font-size:15px;color:#111827;">${escapeHtmlMin(data.phone)}</p>` : ""}
          <p style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;">Nội dung</p>
          <blockquote style="margin:0;padding:14px 16px;background:#f9fafb;border-left:3px solid #f97316;border-radius:0 8px 8px 0;">
            <p style="margin:0;font-size:14px;color:#374151;white-space:pre-wrap;">${escapeHtmlMin(data.message)}</p>
          </blockquote>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid #f3f4f6;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">Email tự động từ form liên hệ trên website.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  try {
    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": POSTMARK_TOKEN,
      },
      body: JSON.stringify({
        From: FROM,
        To: NOTIFY_EMAIL,
        Subject: `📩 Liên hệ mới từ ${data.name}`,
        HtmlBody: html,
        TextBody: `Tin nhắn từ ${data.name}${data.email ? ` <${data.email}>` : ""}${data.phone ? ` | ${data.phone}` : ""}:\n\n${data.message}`,
        MessageStream: "outbound",
      }),
    })
  } catch {
    // Non-critical
  }
}

// ── Password reset email ──────────────────────────────────────────────────────

export async function sendPasswordResetEmail({
  email,
  resetUrl,
  name,
}: {
  email: string
  resetUrl: string
  name?: string | null
}) {
  if (!POSTMARK_TOKEN) return

  const html = `
<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;max-width:560px;overflow:hidden;">
        <tr><td style="background:#f97316;padding:20px 32px;">
          <p style="margin:0;color:#fff;font-size:18px;font-weight:700;">🔐 Đặt lại mật khẩu</p>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <p style="margin:0 0 16px;font-size:15px;color:#111827;">Xin chào${name ? ` <strong>${escapeHtmlMin(name)}</strong>` : ""},</p>
          <p style="margin:0 0 24px;font-size:14px;color:#374151;line-height:1.6;">
            Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn vào nút bên dưới để tiến hành. Link có hiệu lực trong <strong>1 giờ</strong>.
          </p>
          <table cellpadding="0" cellspacing="0"><tr><td>
            <a href="${resetUrl}" style="display:inline-block;background:#f97316;color:#fff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">
              Đặt lại mật khẩu →
            </a>
          </td></tr></table>
          <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">
            Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.
          </p>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid #f3f4f6;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">Email tự động — đừng trả lời email này.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  try {
    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": POSTMARK_TOKEN,
      },
      body: JSON.stringify({
        From: FROM,
        To: email,
        Subject: "Đặt lại mật khẩu của bạn",
        HtmlBody: html,
        TextBody: `Nhấn vào link sau để đặt lại mật khẩu (hiệu lực 1 giờ):\n${resetUrl}\n\nNếu bạn không yêu cầu, hãy bỏ qua email này.`,
        MessageStream: "outbound",
      }),
    })
  } catch {
    // Non-critical
  }
}

function escapeHtmlMin(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
