"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface ProfileFormProps {
  user: { id: string; name: string; email: string; image: string }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [name, setName] = React.useState(user.name)
  const [image, setImage] = React.useState(user.image)
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [savingInfo, setSavingInfo] = React.useState(false)
  const [savingPassword, setSavingPassword] = React.useState(false)

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault()
    setSavingInfo(true)
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image: image || null }),
    })
    setSavingInfo(false)
    if (res.ok) {
      toast({ description: "Đã cập nhật thông tin." })
      router.refresh()
    } else {
      toast({ description: "Có lỗi xảy ra, vui lòng thử lại.", variant: "destructive" })
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({ description: "Mật khẩu xác nhận không khớp.", variant: "destructive" })
      return
    }
    if (newPassword.length < 6) {
      toast({ description: "Mật khẩu mới phải có ít nhất 6 ký tự.", variant: "destructive" })
      return
    }
    setSavingPassword(true)
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    setSavingPassword(false)
    if (res.ok) {
      toast({ description: "Đã đổi mật khẩu thành công." })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      const data = await res.json().catch(() => ({}))
      toast({ description: data.message ?? "Mật khẩu hiện tại không đúng.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      {/* Info form */}
      <form onSubmit={handleSaveInfo} className="rounded-2xl border bg-card p-6 space-y-5">
        <h2 className="font-heading text-lg font-semibold">Thông tin cá nhân</h2>

        <div className="space-y-2">
          <Label htmlFor="name">Tên hiển thị</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled className="opacity-60" />
          <p className="text-xs text-muted-foreground">Email không thể thay đổi.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">URL ảnh đại diện</Label>
          <Input
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
          />
          {image && (
            <img src={image} alt="Preview" className="h-12 w-12 rounded-full object-cover border" />
          )}
        </div>

        <Button type="submit" disabled={savingInfo}>
          {savingInfo && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Lưu thay đổi
        </Button>
      </form>

      {/* Password form */}
      <form onSubmit={handleChangePassword} className="rounded-2xl border bg-card p-6 space-y-5">
        <h2 className="font-heading text-lg font-semibold">Đổi mật khẩu</h2>

        <div className="space-y-2">
          <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">Mật khẩu mới</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" disabled={savingPassword || !currentPassword || !newPassword}>
          {savingPassword && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Đổi mật khẩu
        </Button>
      </form>
    </div>
  )
}
