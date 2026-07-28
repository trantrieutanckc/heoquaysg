import Script from "next/script"

// Parse raw HTML tracking code block thành list các script để inject đúng cách.
// Xử lý 3 loại:
//   1. <script async src="..."> → external script (GA4, GTM loader)
//   2. <script>...</script> inline → inline JS (gtag init, GTM snippet, FB Pixel)
//   3. <noscript>...</noscript> → bỏ qua (không critical với Next.js)
function parseScripts(raw: string): { type: "src" | "inline"; src?: string; content?: string }[] {
  const results: { type: "src" | "inline"; src?: string; content?: string }[] = []
  const scriptRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi
  let match

  while ((match = scriptRe.exec(raw)) !== null) {
    const attrs = match[1]
    const content = match[2].trim()
    const srcMatch = /src=["']([^"']+)["']/.exec(attrs)

    if (srcMatch) {
      results.push({ type: "src", src: srcMatch[1] })
    } else if (content) {
      results.push({ type: "inline", content })
    }
  }

  return results
}

export function TrackingScripts({ code }: { code: string }) {
  const scripts = parseScripts(code)
  if (!scripts.length) return null

  return (
    <>
      {scripts.map((s, i) =>
        s.type === "src" ? (
          <Script
            key={`tracking-src-${i}`}
            id={`tracking-src-${i}`}
            src={s.src}
            strategy="afterInteractive"
          />
        ) : (
          <Script
            key={`tracking-inline-${i}`}
            id={`tracking-inline-${i}`}
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: s.content! }}
          />
        )
      )}
    </>
  )
}
