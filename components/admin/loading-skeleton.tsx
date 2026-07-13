import { Skeleton } from "@/components/ui/skeleton"
import { ReactNode } from "react"

// Row: thumbnail vuông + 2 dòng text + slot bên phải tuỳ chọn
export function SkeletonRow({ right }: { right?: ReactNode } = {}) {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="h-10 w-10 rounded shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      {right}
    </div>
  )
}

// Card với title + nội dung tuỳ chọn (about, lien-he…)
export function SkeletonCard({ titleWidth = "w-32", children }: { titleWidth?: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <Skeleton className={`h-4 ${titleWidth}`} />
      {children}
    </div>
  )
}

// Card với title + label/input pairs — dùng cho settings
export function SkeletonSectionCard({ fields = 2 }: { fields?: number }) {
  return (
    <div className="rounded-2xl border bg-card p-6 space-y-5">
      <Skeleton className="h-5 w-36" />
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="grid gap-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  )
}
