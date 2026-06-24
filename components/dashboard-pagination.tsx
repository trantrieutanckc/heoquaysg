import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface Props {
  currentPage: number
  totalPages: number
  basePath: string
}

export function DashboardPagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-sm text-muted-foreground">
        Trang {currentPage} / {totalPages}
      </p>
      <div className="flex items-center gap-2">
        {hasPrev ? (
          <Link
            href={`${basePath}?page=${currentPage - 1}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Trước
          </Link>
        ) : (
          <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "opacity-40 cursor-not-allowed pointer-events-none")}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Trước
          </span>
        )}
        {hasNext ? (
          <Link
            href={`${basePath}?page=${currentPage + 1}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Sau
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        ) : (
          <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "opacity-40 cursor-not-allowed pointer-events-none")}>
            Sau
            <ChevronRight className="h-4 w-4 ml-1" />
          </span>
        )}
      </div>
    </div>
  )
}
