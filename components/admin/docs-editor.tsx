"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface Doc {
  key: string
  title: string
  content: string
}

interface DocsEditorProps {
  docs: Doc[]
  isAdmin: boolean
}

function renderMarkdown(text: string) {
  const lines = text.split("\n")
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith("# ")) {
      elements.push(<h1 key={i} className="font-heading text-2xl font-bold mt-6 mb-3 first:mt-0">{line.slice(2)}</h1>)
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="font-heading text-lg font-semibold mt-5 mb-2 text-foreground">{line.slice(3)}</h2>)
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="font-medium mt-4 mb-1">{line.slice(4)}</h3>)
    } else if (line.startsWith("| ")) {
      // Table
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith("| ")) {
        tableLines.push(lines[i])
        i++
      }
      const rows = tableLines.filter((r) => !r.match(/^\|[-| ]+\|$/))
      elements.push(
        <div key={i} className="overflow-x-auto my-3">
          <table className="w-full text-sm border-collapse border border-border rounded">
            <tbody>
              {rows.map((row, ri) => {
                const cells = row.split("|").filter((_, ci) => ci > 0 && ci < row.split("|").length - 1)
                return (
                  <tr key={ri} className={ri === 0 ? "bg-muted font-medium" : "border-t border-border"}>
                    {cells.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 border-r border-border last:border-r-0">{cell.trim()}</td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
      continue
    } else if (line.match(/^(\d+)\. /)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^(\d+)\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ""))
        i++
      }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-1 my-2 text-sm text-muted-foreground">
          {items.map((item, ii) => <li key={ii} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />)}
        </ol>
      )
      continue
    } else if (line.startsWith("- ")) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1 my-2 text-sm text-muted-foreground">
          {items.map((item, ii) => <li key={ii} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />)}
        </ul>
      )
      continue
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-1" />)
    } else {
      elements.push(
        <p key={i} className="text-sm text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      )
    }
    i++
  }
  return elements
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

function formatInline(text: string) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">$1</code>')
}

export function DocsEditor({ docs, isAdmin }: DocsEditorProps) {
  const [activeKey, setActiveKey] = React.useState(docs[0]?.key ?? "")
  const [editing, setEditing] = React.useState(false)
  const [contents, setContents] = React.useState<Record<string, string>>(
    Object.fromEntries(docs.map((d) => [d.key, d.content]))
  )
  const [titles, setTitles] = React.useState<Record<string, string>>(
    Object.fromEntries(docs.map((d) => [d.key, d.title]))
  )
  const [saving, setSaving] = React.useState(false)

  const activeDoc = docs.find((d) => d.key === activeKey)

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/docs/${activeKey}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: contents[activeKey], title: titles[activeKey] }),
    })
    setSaving(false)
    if (res.ok) {
      toast({ description: "Đã lưu hướng dẫn." })
      setEditing(false)
    } else {
      toast({ description: "Không thể lưu.", variant: "destructive" })
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
      {/* Sidebar tabs */}
      <nav className="flex flex-row md:flex-col gap-1">
        {docs.map((doc) => (
          <button
            key={doc.key}
            type="button"
            onClick={() => { setActiveKey(doc.key); setEditing(false) }}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium text-left transition-colors",
              activeKey === doc.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {titles[doc.key] ?? doc.title}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="font-heading font-semibold">{titles[activeKey] ?? activeDoc?.title}</h2>
          {isAdmin && (
            <div className="flex items-center gap-2">
              {editing ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Huỷ</Button>
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    {saving && <Icons.spinner className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                    Lưu
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Icons.edit className="mr-1.5 h-3.5 w-3.5" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="p-5">
          {editing ? (
            <textarea
              className="w-full min-h-[500px] rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              value={contents[activeKey] ?? ""}
              onChange={(e) => setContents((prev) => ({ ...prev, [activeKey]: e.target.value }))}
              placeholder="Nhập nội dung hướng dẫn..."
            />
          ) : (
            <div className="prose-sm max-w-none">
              {renderMarkdown(contents[activeKey] ?? "")}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
