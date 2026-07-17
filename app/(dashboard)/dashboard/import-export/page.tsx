"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// ─── Helpers ───────────────────────────────────────────────────────────────

const ICON_EXPORT = (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const ICON_IMPORT = (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 5 17 10" />
    <line x1="12" y1="5" x2="12" y2="15" />
  </svg>
)

const ICON_TEMPLATE = (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
)

const ICON_SPIN = (
  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

function downloadBlob(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Import Section ─────────────────────────────────────────────────────────

function ImportButton({
  endpoint,
  label,
  onSuccess,
}: {
  endpoint: string
  label: string
  onSuccess?: (data: { created: number; errors: string[] }) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [loading, setLoading] = React.useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""
    setLoading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch(endpoint, { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: "Import thất bại", description: data.error ?? "Lỗi không xác định.", variant: "destructive" })
        return
      }
      onSuccess?.(data)
    } catch {
      toast({ title: "Lỗi kết nối", description: "Không thể import.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5", loading && "opacity-60 cursor-not-allowed")}
      >
        {loading ? ICON_SPIN : ICON_IMPORT}
        {label}
      </button>
    </>
  )
}

// ─── Card ───────────────────────────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  description,
  columns,
  exportHref,
  importEndpoint,
  templateContent,
  templateFilename,
  onImported,
}: {
  icon: string
  title: string
  description: string
  columns: string
  exportHref?: string
  importEndpoint?: string
  templateContent?: string
  templateFilename?: string
  onImported?: (data: { created: number; errors: string[] }) => void
}) {
  return (
    <div className="rounded-lg border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>

      <div className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground font-mono">
        {columns}
      </div>

      <div className="flex flex-wrap gap-2">
        {exportHref && (
          <a href={exportHref} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}>
            {ICON_EXPORT}
            Export CSV
          </a>
        )}
        {importEndpoint && (
          <ImportButton
            endpoint={importEndpoint}
            label="Import CSV"
            onSuccess={onImported}
          />
        )}
        {templateContent && templateFilename && (
          <button
            onClick={() => downloadBlob(templateContent, templateFilename)}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1 text-muted-foreground")}
          >
            {ICON_TEMPLATE}
            File mẫu
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

const POSTS_TEMPLATE = `title,price,categories
"Heo Quay Lá Mắc Mật",250000,"Món Quay|Đặc Sản"
"Vịt Quay Bắc Kinh",320000,"Vịt Quay"
"Gà Quay Mật Ong",180000,""
`

const DISHES_TEMPLATE = `group,name,description,price,unit,available,order
"Heo Quay","Heo Quay Nguyên Con","Heo quay nguyên con phục vụ tiệc cúng",1500000,"con",true,1
"Heo Quay","Heo Quay Nửa Con","",800000,"nửa con",true,2
"Món Phụ","Cơm Trắng","Cơm trắng dẻo ăn kèm",15000,"phần",true,1
`

export default function ImportExportPage() {
  const router = useRouter()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Import / Export"
        text="Xuất hoặc nhập dữ liệu hàng loạt qua file CSV."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard
          icon="📝"
          title="Bài viết"
          description="Export toàn bộ bài viết của bạn. Import để tạo hàng loạt bài nháp."
          columns="title · price · categories"
          exportHref="/api/posts/export"
          importEndpoint="/api/posts/import"
          templateContent={POSTS_TEMPLATE}
          templateFilename="bai-viet-mau.csv"
          onImported={(data) => {
            toast({
              title: `Đã tạo ${data.created} bài viết nháp`,
              description: data.errors?.length ? `${data.errors.length} dòng lỗi` : "Import hoàn tất.",
              variant: data.errors?.length ? "default" : "success",
            })
            router.refresh()
          }}
        />

        <SectionCard
          icon="🍖"
          title="Thực đơn"
          description="Export toàn bộ thực đơn. Import để thêm hàng loạt món ăn — nhóm tự tạo nếu chưa có."
          columns="group · name · description · price · unit · available · order"
          exportHref="/api/dishes/export"
          importEndpoint="/api/dishes/import"
          templateContent={DISHES_TEMPLATE}
          templateFilename="thuc-don-mau.csv"
          onImported={(data) => {
            toast({
              title: `Đã thêm ${data.created} món`,
              description: data.errors?.length ? `${data.errors.length} dòng lỗi` : "Import hoàn tất.",
              variant: data.errors?.length ? "default" : "success",
            })
            router.refresh()
          }}
        />

        <SectionCard
          icon="📅"
          title="Đặt lịch giao hàng"
          description="Export toàn bộ đơn đặt lịch ra CSV để xem hoặc lưu trữ."
          columns="id · name · phone · address · items · deliveryDate · note · status · createdAt"
          exportHref="/api/bookings/export"
        />

        <SectionCard
          icon="📧"
          title="Subscribers"
          description="Export danh sách email đã đăng ký newsletter."
          columns="id · email · name · active · subscribedAt"
          exportHref="/api/newsletter/export"
        />
      </div>
    </DashboardShell>
  )
}
