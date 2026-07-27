import Link from "next/link"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface Props {
  currentPage: number
  totalPages: number
  basePath: string
  extraParams?: Record<string, string>
}

function pageUrl(basePath: string, page: number, extra?: Record<string, string>) {
  const params = new URLSearchParams(extra)
  if (page > 1) params.set("page", String(page))
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

function NavBtn({
  href,
  disabled,
  children,
  label,
}: {
  href: string
  disabled: boolean
  children: React.ReactNode
  label: string
}) {
  if (disabled) {
    return (
      <span
        aria-label={label}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-8 w-8 opacity-40 cursor-not-allowed pointer-events-none"
        )}
      >
        {children}
      </span>
    )
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(buttonVariants({ variant: "outline", size: "icon" }), "h-8 w-8")}
    >
      {children}
    </Link>
  )
}

export function DashboardPagination({ currentPage, totalPages, basePath, extraParams }: Props) {
  if (totalPages <= 1) return null

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-sm text-muted-foreground">
        Trang {currentPage} / {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <NavBtn href={pageUrl(basePath, 1, extraParams)} disabled={!hasPrev} label="Trang đầu">
          <ChevronsLeft className="h-4 w-4" />
        </NavBtn>
        <NavBtn href={pageUrl(basePath, currentPage - 1, extraParams)} disabled={!hasPrev} label="Trang trước">
          <ChevronLeft className="h-4 w-4" />
        </NavBtn>
        <NavBtn href={pageUrl(basePath, currentPage + 1, extraParams)} disabled={!hasNext} label="Trang sau">
          <ChevronRight className="h-4 w-4" />
        </NavBtn>
        <NavBtn href={pageUrl(basePath, totalPages, extraParams)} disabled={!hasNext} label="Trang cuối">
          <ChevronsRight className="h-4 w-4" />
        </NavBtn>
      </div>
    </div>
  )
}
