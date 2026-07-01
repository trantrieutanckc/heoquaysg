"use client"

import * as React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import Placeholder from "@tiptap/extension-placeholder"
import { cn } from "@/lib/utils"

function Btn({ active, title, onClick, children }: {
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
        "h-7 w-7 rounded flex items-center justify-center text-sm transition-colors",
        active
          ? "bg-foreground text-background"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

interface Props {
  value?: string
  onChange: (json: string) => void
  placeholder?: string
}

export function MiniTiptapEditor({ value, onChange, placeholder = "Nhập nội dung..." }: Props) {
  const initial = React.useMemo(() => {
    if (!value) return undefined
    try { return JSON.parse(value) } catch { return undefined }
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: initial,
    onUpdate({ editor }) {
      onChange(JSON.stringify(editor.getJSON()))
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[100px] px-3 py-2",
      },
    },
  })

  if (!editor) return null

  return (
    <div className="rounded-md border border-input bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b px-2 py-1.5 flex-wrap">
        <Btn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </Btn>
        <Btn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </Btn>
        <Btn title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">U</span>
        </Btn>
        <div className="w-px h-4 bg-border mx-1" />
        <Btn title="Danh sách" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
            <rect x="5" y="3" width="8" height="1.5" rx="0.5"/><rect x="5" y="7.25" width="8" height="1.5" rx="0.5"/><rect x="5" y="11.5" width="8" height="1.5" rx="0.5"/>
            <circle cx="2.5" cy="3.75" r="1"/><circle cx="2.5" cy="8" r="1"/><circle cx="2.5" cy="12.25" r="1"/>
          </svg>
        </Btn>
        <Btn title="Danh sách số" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
            <rect x="5" y="3" width="8" height="1.5" rx="0.5"/><rect x="5" y="7.25" width="8" height="1.5" rx="0.5"/><rect x="5" y="11.5" width="8" height="1.5" rx="0.5"/>
            <text x="1" y="5" fontSize="4.5" fontWeight="bold">1</text><text x="1" y="9.5" fontSize="4.5" fontWeight="bold">2</text><text x="1" y="14" fontSize="4.5" fontWeight="bold">3</text>
          </svg>
        </Btn>
        <div className="w-px h-4 bg-border mx-1" />
        <Btn
          title="Link"
          active={editor.isActive("link")}
          onClick={() => {
            const url = editor.isActive("link")
              ? null
              : window.prompt("URL:")
            if (url === null && !editor.isActive("link")) return
            if (url === null) {
              editor.chain().focus().unsetLink().run()
            } else {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
        >
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 9a4 4 0 0 0 5.66.06l1.5-1.5A4 4 0 0 0 8.5 2L7 3.5"/><path d="M9 7a4 4 0 0 0-5.66-.06l-1.5 1.5A4 4 0 0 0 7.5 14L9 12.5"/>
          </svg>
        </Btn>
        <Btn title="Xoá định dạng" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3l10 10M6.5 3.5H13v1.5l-5 5m-3.5.5-1 1.5h7"/><line x1="2" y1="2" x2="14" y2="14"/>
          </svg>
        </Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
