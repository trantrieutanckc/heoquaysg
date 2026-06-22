"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { User } from "@prisma/client"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { UserAvatar } from "@/components/user-avatar"
import { ImageUploader } from "@/components/image-uploader"

interface UserAvatarFormProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "id" | "name" | "image">
}

export function UserAvatarForm({ user, className }: UserAvatarFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState(user.image ?? "")

  async function onSave() {
    setIsSaving(true)

    const response = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageUrl || null }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Lưu thất bại.",
        description: "Không thể cập nhật ảnh đại diện. Vui lòng thử lại.",
        variant: "destructive",
      })
    }

    toast({ description: "Ảnh đại diện đã được cập nhật." })
    router.refresh()
  }

  return (
    <div className={cn(className)}>
      <Card>
        <CardHeader>
          <CardTitle>Ảnh đại diện</CardTitle>
          <CardDescription>
            Tải lên ảnh đại diện của bạn. Hỗ trợ PNG, JPG, WebP — tối đa 5MB.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-4">
            <UserAvatar
              user={{ name: user.name, image: imageUrl || null }}
              className="h-16 w-16"
            />
            <div className="text-sm text-muted-foreground">
              Xem trước ảnh đại diện hiện tại
            </div>
          </div>
          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
          />
        </CardContent>
        <CardFooter>
          <button
            type="button"
            onClick={onSave}
            className={cn(buttonVariants())}
            disabled={isSaving || imageUrl === (user.image ?? "")}
          >
            {isSaving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            <span>Lưu</span>
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
