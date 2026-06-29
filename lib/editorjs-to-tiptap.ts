// Convert EditorJS block format → TipTap ProseMirror JSON
// Used on first load of old content in the new TipTap editor

interface EditorJSBlock {
  type: string
  data: Record<string, any>
}

interface TiptapNode {
  type: string
  attrs?: Record<string, any>
  content?: TiptapNode[]
  marks?: { type: string; attrs?: Record<string, any> }[]
  text?: string
}

function textNodes(html: string): TiptapNode[] {
  // Strip HTML tags to plain text nodes (basic support)
  const plain = html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")
  if (!plain) return []
  return [{ type: "text", text: plain }]
}

function blockToNode(block: EditorJSBlock): TiptapNode | null {
  switch (block.type) {
    case "paragraph":
      return {
        type: "paragraph",
        content: textNodes(block.data.text ?? ""),
      }

    case "header":
      return {
        type: "heading",
        attrs: { level: block.data.level ?? 2 },
        content: textNodes(block.data.text ?? ""),
      }

    case "list": {
      const isOrdered = block.data.style === "ordered"
      return {
        type: isOrdered ? "orderedList" : "bulletList",
        content: (block.data.items ?? []).map((item: string) => ({
          type: "listItem",
          content: [{ type: "paragraph", content: textNodes(item) }],
        })),
      }
    }

    case "image":
      return {
        type: "image",
        attrs: {
          src: block.data.file?.url ?? block.data.url ?? "",
          alt: block.data.caption ?? "",
          title: block.data.caption ?? "",
        },
      }

    case "code":
      return {
        type: "codeBlock",
        content: [{ type: "text", text: block.data.code ?? "" }],
      }

    case "quote":
      return {
        type: "blockquote",
        content: [{ type: "paragraph", content: textNodes(block.data.text ?? "") }],
      }

    case "delimiter":
      return { type: "horizontalRule" }

    case "table": {
      const rows = block.data.content ?? []
      return {
        type: "table",
        content: rows.map((row: string[], rowIdx: number) => ({
          type: "tableRow",
          content: row.map((cell: string) => ({
            type: rowIdx === 0 ? "tableHeader" : "tableCell",
            attrs: { colspan: 1, rowspan: 1 },
            content: [{ type: "paragraph", content: textNodes(cell) }],
          })),
        })),
      }
    }

    case "embed":
      // Convert YouTube embeds to a paragraph with the URL
      return {
        type: "paragraph",
        content: [{ type: "text", text: block.data.source ?? block.data.embed ?? "" }],
      }

    default:
      return null
  }
}

export function editorJsToTiptap(content: unknown): object {
  if (!content || typeof content !== "object") {
    return { type: "doc", content: [{ type: "paragraph" }] }
  }

  const blocks = (content as any).blocks
  if (!Array.isArray(blocks)) {
    // Already TipTap format
    if ((content as any).type === "doc") return content as object
    return { type: "doc", content: [{ type: "paragraph" }] }
  }

  const nodes = blocks.map(blockToNode).filter(Boolean) as TiptapNode[]
  return {
    type: "doc",
    content: nodes.length ? nodes : [{ type: "paragraph" }],
  }
}

export function isTiptapContent(content: unknown): boolean {
  return (
    !!content &&
    typeof content === "object" &&
    (content as any).type === "doc"
  )
}
