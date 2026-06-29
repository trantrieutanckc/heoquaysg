"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"

type Role = "ADMIN" | "EDITOR" | "CONTRIBUTOR"

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin",
  EDITOR: "Editor",
  CONTRIBUTOR: "Contributor",
}

export function UserCreateButton() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [role, setRole] = React.useState<Role>("CONTRIBUTOR")
  const [isLoading, setIsLoading] = React.useState(false)

  async function handleCreate() {
    if (!name.trim() || !email.trim() || password.length < 6) return
    setIsLoading(true)

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), role, password }),
    })

    setIsLoading(false)

    if (res.status === 409) {
      return toast({ title: "Lỗi", description: "Email đã tồn tại.", variant: "destructive" })
    }

    if (!res.ok) {
      return toast({ title: "Lỗi", description: "Không thể tạo user.", variant: "destructive" })
    }

    toast({ description: "Đã tạo user thành công." })
    setOpen(false)
    setName("")
    setEmail("")
    setPassword("")
    setRole("CONTRIBUTOR")
    router.refresh()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className="mr-2 h-4 w-4" />
        Tạo User
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo user mới</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="user-name">Tên</Label>
              <Input
                id="user-name"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-password">Mật khẩu</Label>
              <Input
                id="user-password"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password.length > 0 && password.length < 6 && (
                <p className="text-xs text-destructive">Mật khẩu tối thiểu 6 ký tự</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Vai trò</Label>
              <div className="flex gap-2">
                {(["ADMIN", "EDITOR", "CONTRIBUTOR"] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      role === r
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    {ROLE_LABELS[r]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button
              onClick={handleCreate}
              disabled={!name.trim() || !email.trim() || password.length < 6 || isLoading}
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Tạo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
