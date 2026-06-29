// Server-side TipTap JSON → HTML renderer (no DOM dependency)
// Note: StarterKit includes codeBlock by default — no need to disable it

type Mark = { type: string; attrs?: Record<string, any> }
type Node = { type: string; attrs?: Record<string, any>; content?: Node[]; marks?: Mark[]; text?: string }

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function attrs(obj: Record<string, any> = {}): string {
  return Object.entries(obj)
    .filter(([, v]) => v != null && v !== false && v !== "")
    .map(([k, v]) => ` ${k}="${esc(String(v))}"`)
    .join("")
}

function renderText(node: Node): string {
  let text = esc(node.text ?? "")
  for (const mark of node.marks ?? []) {
    switch (mark.type) {
      case "bold": text = `<strong>${text}</strong>`; break
      case "italic": text = `<em>${text}</em>`; break
      case "underline": text = `<u>${text}</u>`; break
      case "strike": text = `<s>${text}</s>`; break
      case "code": text = `<code>${text}</code>`; break
      case "highlight": {
        const color = mark.attrs?.color
        text = color ? `<mark style="background-color:${esc(color)}">${text}</mark>` : `<mark>${text}</mark>`
        break
      }
      case "textStyle": {
        const color = mark.attrs?.color
        if (color) text = `<span style="color:${esc(color)}">${text}</span>`
        break
      }
      case "link": {
        const href = mark.attrs?.href ?? ""
        const isExternal = href.startsWith("http") || href.startsWith("//")
        const rel = isExternal ? ' rel="noopener noreferrer"' : ""
        const target = isExternal ? ' target="_blank"' : ""
        text = `<a href="${esc(href)}"${target}${rel}>${text}</a>`
        break
      }
    }
  }
  return text
}

let headingCount = 0

function renderNode(node: Node): string {
  const children = (node.content ?? []).map(renderNode).join("")

  switch (node.type) {
    case "doc":
      return children

    case "text":
      return renderText(node)

    case "paragraph": {
      const align = node.attrs?.textAlign
      const style = align && align !== "left" ? ` style="text-align:${align}"` : ""
      return `<p${style}>${children}</p>`
    }

    case "heading": {
      const level = node.attrs?.level ?? 2
      const id = `toc-${headingCount++}`
      const align = node.attrs?.textAlign
      const style = align && align !== "left" ? ` style="text-align:${align}"` : ""
      return `<h${level} id="${id}"${style}>${children}</h${level}>`
    }

    case "bulletList":
      return `<ul>${children}</ul>`

    case "orderedList":
      return `<ol>${children}</ol>`

    case "listItem":
      return `<li>${children}</li>`

    case "blockquote":
      return `<blockquote>${children}</blockquote>`

    case "codeBlock": {
      const lang = node.attrs?.language ? ` class="language-${esc(node.attrs.language)}"` : ""
      return `<pre><code${lang}>${children}</code></pre>`
    }

    case "horizontalRule":
      return `<hr>`

    case "hardBreak":
      return `<br>`

    case "image": {
      const src = node.attrs?.src ?? ""
      const alt = node.attrs?.alt ?? ""
      const title = node.attrs?.title ?? ""
      return `<img src="${esc(src)}" alt="${esc(alt)}"${title ? ` title="${esc(title)}"` : ""} class="rounded-md w-full object-cover">`
    }

    case "table":
      return `<div class="overflow-x-auto"><table>${children}</table></div>`

    case "tableRow":
      return `<tr>${children}</tr>`

    case "tableHeader":
      return `<th${attrs({ colspan: node.attrs?.colspan, rowspan: node.attrs?.rowspan })}>${children}</th>`

    case "tableCell":
      return `<td${attrs({ colspan: node.attrs?.colspan, rowspan: node.attrs?.rowspan })}>${children}</td>`

    case "columns":
      return `<div data-type="columns" class="tiptap-columns">${children}</div>`

    case "column":
      return `<div data-type="column" class="tiptap-column">${children}</div>`

    default:
      return children
  }
}

export function tiptapToHtml(content: unknown): string {
  if (!content || typeof content !== "object") return ""
  headingCount = 0
  try {
    return renderNode(content as Node)
  } catch {
    return ""
  }
}

export function extractHeadingsTiptap(content: unknown): { id: string; text: string; level: number }[] {
  if (!content || typeof content !== "object") return []
  const doc = content as any
  if (doc.type !== "doc" || !Array.isArray(doc.content)) return []

  const headings: { id: string; text: string; level: number }[] = []
  let n = 0

  function walk(nodes: any[]) {
    for (const node of nodes) {
      if (node.type === "heading") {
        const text = (node.content ?? [])
          .filter((c: any) => c.type === "text")
          .map((c: any) => c.text ?? "")
          .join("")
        headings.push({ id: `toc-${n++}`, text, level: node.attrs?.level ?? 2 })
      }
      if (Array.isArray(node.content)) walk(node.content)
    }
  }
  walk(doc.content)
  return headings
}

interface Props {
  content: unknown
  className?: string
}

export function TiptapRenderer({ content, className }: Props) {
  const html = tiptapToHtml(content)
  if (!html) return null

  return (
    <div
      className={className ?? "prose prose-stone dark:prose-invert max-w-none [&_.tiptap-columns]:grid [&_.tiptap-columns]:grid-cols-2 [&_.tiptap-columns]:gap-6 [&_.tiptap-column]:min-w-0"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
