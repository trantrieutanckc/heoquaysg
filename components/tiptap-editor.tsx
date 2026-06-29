"use client"

import * as React from "react"
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import Highlight from "@tiptap/extension-highlight"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import { cn } from "@/lib/utils"

// ── Custom 2-column extension ──────────────────────────────────────────────
import { Node, mergeAttributes } from "@tiptap/core"

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

// ── Toolbar button ─────────────────────────────────────────────────────────
function ToolBtn({
  active,
  title,
  onClick,
  children,
}: {
  active?: boolean
  title: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded text-sm transition-colors",
        active
          ? "bg-foreground text-background"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="mx-0.5 h-5 w-px bg-border" />
}

// ── Icons (inline SVG for zero-import overhead) ────────────────────────────
const I = {
  bold: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>,
  italic: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
  underline: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>,
  strike: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>,
  h2: <span className="text-xs font-bold">H2</span>,
  h3: <span className="text-xs font-bold">H3</span>,
  h4: <span className="text-xs font-bold">H4</span>,
  ul: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/></svg>,
  ol: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>,
  quote: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>,
  code: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  hr: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  link: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  image: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  table: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/></svg>,
  columns: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/></svg>,
  alignL: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>,
  alignC: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>,
  alignR: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>,
  highlight: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>,
}

// ── Props ──────────────────────────────────────────────────────────────────
export interface TiptapEditorProps {
  content: object | null
  onChange: (json: object) => void
  placeholder?: string
  className?: string
}

// ── Main component ─────────────────────────────────────────────────────────
export function TiptapEditor({
  content,
  onChange,
  placeholder = "Viết nội dung...",
  className,
}: TiptapEditorProps) {
  const imageInputRef = React.useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Highlight,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Image.configure({ allowBase64: false, HTMLAttributes: { class: "rounded-md max-w-full" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      ColumnsNode,
      ColumnNode,
      Placeholder.configure({ placeholder }),
    ],
    content: content ?? { type: "doc", content: [{ type: "paragraph" }] },
    onUpdate({ editor }) {
      onChange(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: "prose prose-stone dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-1 py-2",
      },
    },
  })

  if (!editor) return null

  // ── Image upload ─────────────────────────────────────────────────────────
  async function handleImageFile(file: File) {
    const form = new FormData()
    form.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: form })
    const data = await res.json()
    if (data?.success && data?.file?.url) {
      editor.chain().focus().setImage({ src: data.file.url }).run()
    }
  }

  function handleImageUrl() {
    const url = prompt("Nhập URL ảnh:")
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  function handleLink() {
    const prev = editor.getAttributes("link").href as string
    const url = prompt("Nhập URL link:", prev ?? "")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().setLink({ href: url }).run()
  }

  function insertColumns() {
    editor.chain().focus().insertContent({
      type: "columns",
      content: [
        { type: "column", content: [{ type: "paragraph" }] },
        { type: "column", content: [{ type: "paragraph" }] },
      ],
    }).run()
  }

  function insertTable() {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div className={cn("rounded-md border bg-background", className)}>
      {/* ── Toolbar ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
        {/* Text format */}
        <ToolBtn title="In đậm (Ctrl+B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>{I.bold}</ToolBtn>
        <ToolBtn title="In nghiêng (Ctrl+I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>{I.italic}</ToolBtn>
        <ToolBtn title="Gạch chân" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>{I.underline}</ToolBtn>
        <ToolBtn title="Gạch ngang" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>{I.strike}</ToolBtn>
        <ToolBtn title="Highlight" active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()}>{I.highlight}</ToolBtn>

        <Divider />

        {/* Headings */}
        <ToolBtn title="Tiêu đề H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>{I.h2}</ToolBtn>
        <ToolBtn title="Tiêu đề H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>{I.h3}</ToolBtn>
        <ToolBtn title="Tiêu đề H4" active={editor.isActive("heading", { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>{I.h4}</ToolBtn>

        <Divider />

        {/* Lists */}
        <ToolBtn title="Danh sách" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>{I.ul}</ToolBtn>
        <ToolBtn title="Danh sách đánh số" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>{I.ol}</ToolBtn>
        <ToolBtn title="Trích dẫn" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>{I.quote}</ToolBtn>
        <ToolBtn title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{I.code}</ToolBtn>
        <ToolBtn title="Đường kẻ ngang" active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()}>{I.hr}</ToolBtn>

        <Divider />

        {/* Align */}
        <ToolBtn title="Căn trái" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>{I.alignL}</ToolBtn>
        <ToolBtn title="Căn giữa" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>{I.alignC}</ToolBtn>
        <ToolBtn title="Căn phải" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>{I.alignR}</ToolBtn>

        <Divider />

        {/* Media & layout */}
        <ToolBtn title="Link" active={editor.isActive("link")} onClick={handleLink}>{I.link}</ToolBtn>
        <ToolBtn title="Chèn ảnh (URL)" active={false} onClick={handleImageUrl}>{I.image}</ToolBtn>
        <ToolBtn title="Tải ảnh lên" active={false} onClick={() => imageInputRef.current?.click()}>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </ToolBtn>
        <ToolBtn title="Chèn bảng" active={editor.isActive("table")} onClick={insertTable}>{I.table}</ToolBtn>
        <ToolBtn title="Chia 2 cột" active={editor.isActive("columns")} onClick={insertColumns}>{I.columns}</ToolBtn>
      </div>

      {/* Hidden file input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) await handleImageFile(file)
          e.target.value = ""
        }}
      />

      {/* ── Bubble menu (inline format) ────────────────────────── */}
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="flex items-center gap-0.5 rounded-md border bg-background px-1.5 py-1 shadow-md"
      >
        <ToolBtn title="In đậm" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>{I.bold}</ToolBtn>
        <ToolBtn title="In nghiêng" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>{I.italic}</ToolBtn>
        <ToolBtn title="Gạch chân" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>{I.underline}</ToolBtn>
        <ToolBtn title="Link" active={editor.isActive("link")} onClick={handleLink}>{I.link}</ToolBtn>
        <ToolBtn title="Highlight" active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()}>{I.highlight}</ToolBtn>
      </BubbleMenu>

      {/* ── Editor area ────────────────────────────────────────── */}
      <div className="px-4 py-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
