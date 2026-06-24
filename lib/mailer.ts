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

function escapeHtmlMin(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
