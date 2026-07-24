"use client"

import * as React from "react"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const TEMPLATE_CSV = `group,name,description,unit,available,order
"Heo Quay","Heo Quay Nguyên Con","Heo quay nguyên con phục vụ tiệc cúng","con",true,1
"Heo Quay","Heo Quay Nửa Con","","nửa con",true,2
"Món Phụ","Cơm Trắng","Cơm trắng dẻo ăn kèm","phần",true,1
`

export function DishesImportExport({ onImported }: { onImported?: () => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [importing, setImporting] = React.useState(false)

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "thuc-don-mau.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""

    setImporting(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/dishes/import", { method: "POST", body: form })
      const data = await res.json()

      if (!res.ok) {
        toast({ title: "Import thất bại", description: data.error ?? "Lỗi không xác định.", variant: "destructive" })
        return
      }

      toast({
        title: `Đã thêm ${data.created} món`,
        description: data.errors?.length
          ? `${data.errors.length} dòng lỗi: ${data.errors.slice(0, 2).join("; ")}${data.errors.length > 2 ? "..." : ""}`
          : "Import thực đơn hoàn tất.",
        variant: data.errors?.length ? "default" : "success",
      })
      onImported?.()
    } catch {
      toast({ title: "Lỗi kết nối", description: "Không thể import.", variant: "destructive" })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Export */}
      <a
        href="/api/dishes/export"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export CSV
      </a>

      {/* Import */}
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={importing}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5", importing && "opacity-60 cursor-not-allowed")}
      >
        {importing ? (
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 5 17 10" />
            <line x1="12" y1="5" x2="12" y2="15" />
          </svg>
        )}
        Import CSV
      </button>

      {/* Template */}
      <button
        onClick={downloadTemplate}
        title="Tải file mẫu CSV"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1 text-muted-foreground")}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
        Mẫu
      </button>
    </div>
  )
}
