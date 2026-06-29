import { generateHTML } from "@tiptap/html"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import Highlight from "@tiptap/extension-highlight"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import { Node } from "@tiptap/core"

// Must match the custom nodes defined in tiptap-editor.tsx
const ColumnNode = Node.create({
  name: "column",
  group: "block",
  content: "block+",
  isolating: true,
  parseHTML() { return [{ tag: 'div[data-type="column"]' }] },
  renderHTML() { return ["div", { "data-type": "column", class: "tiptap-column" }, 0] },
})

const ColumnsNode = Node.create({
  name: "columns",
  group: "block",
  content: "column column",
  parseHTML() { return [{ tag: 'div[data-type="columns"]' }] },
  renderHTML() { return ["div", { "data-type": "columns", class: "tiptap-columns" }, 0] },
})

const EXTENSIONS = [
  StarterKit.configure({ codeBlock: false }),
  Underline,
  Highlight,
  TextStyle,
  Color,
  Link.configure({ openOnClick: false }),
  Image,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
  ColumnsNode,
  ColumnNode,
]

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
  if (!content || typeof content !== "object") return null

  let html: string
  try {
    html = generateHTML(content as any, EXTENSIONS)
  } catch {
    return null
  }

  return (
    <div
      className={className ?? "prose prose-stone dark:prose-invert max-w-none [&_.tiptap-columns]:grid [&_.tiptap-columns]:grid-cols-2 [&_.tiptap-columns]:gap-6 [&_.tiptap-column]:min-w-0"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
