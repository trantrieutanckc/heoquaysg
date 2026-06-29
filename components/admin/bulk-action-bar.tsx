"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export interface BulkAction {
  label: string
  action: string
  variant?: "default" | "destructive" | "outline" | "secondary"
  confirm?: boolean
}

interface BulkActionBarProps {
  selectedCount: number
  actions: BulkAction[]
  apiEndpoint: string
  selectedIds: string[]
  onClear: () => void
}

export function BulkActionBar({
  selectedCount,
  actions,
  apiEndpoint,
  selectedIds,
  onClear,
}: BulkActionBarProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null)

  if (selectedCount === 0) return null

  async function runAction(action: string) {
    setLoading(action)
    try {
      await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action }),
      })
      onClear()
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2.5 shadow-lg">
          <span className="text-sm font-medium text-muted-foreground mr-2">
            {selectedCount} đã chọn
          </span>
          {actions.map((a) => (
            <Button
              key={a.action}
              size="sm"
              variant={a.variant ?? "outline"}
              disabled={!!loading}
              onClick={() => (a.confirm ? setConfirmAction(a) : runAction(a.action))}
            >
              {loading === a.action && (
                <Icons.spinner className="mr-1 h-3 w-3 animate-spin" />
              )}
              {a.label}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={onClear} disabled={!!loading}>
            <Icons.close className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(o) => !o && setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn chắc chắn muốn {confirmAction?.label.toLowerCase()} {selectedCount} mục đã chọn?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (confirmAction) runAction(confirmAction.action)
                setConfirmAction(null)
              }}
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
