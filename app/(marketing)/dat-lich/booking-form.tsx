"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  title: string
  price: number | null
}

const TIME_SLOTS = [
  "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00",
]

function today() {
  return new Date().toISOString().split("T")[0]
}

export function BookingForm({ products }: { products: Product[] }) {
  const [productId, setProductId] = React.useState(products[0]?.id ?? "")
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [quantity, setQuantity] = React.useState(1)
  const [date, setDate] = React.useState("")
  const [time, setTime] = React.useState("10:00")
  const [note, setNote] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = React.useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date) { setErrorMsg("Vui lòng chọn ngày giao."); return }
    if (!productId) { setErrorMsg("Vui lòng chọn món."); return }
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, address,
          product: productId,
          quantity,
          deliveryDate: `${date}T${time}:00`,
          note,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus("success")
    } catch {
      setStatus("error")
      setErrorMsg("Có lỗi xảy ra, vui lòng thử lại hoặc gọi điện trực tiếp.")
    }
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
        <p className="font-medium mb-1">Chưa có món nào</p>
        <p className="text-sm">Admin chưa bật đặt lịch cho bài viết nào.</p>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 p-8 text-center space-y-3">
        <div className="mx-auto h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-heading text-xl font-semibold">Đặt lịch thành công!</h2>
        <p className="text-muted-foreground text-sm">
          Chúng tôi đã nhận đơn và sẽ gọi điện xác nhận cho bạn trong thời gian sớm nhất.
        </p>
        <button
          onClick={() => { setStatus("idle"); setDate(""); setNote(""); setAddress("") }}
          className="mt-2 text-sm text-primary hover:underline"
        >
          Đặt thêm đơn khác
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Chọn món */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Món muốn đặt <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setProductId(p.id)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors",
                productId === p.id
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border hover:border-primary/50 text-muted-foreground"
              )}
            >
              <span className="font-semibold text-sm text-foreground line-clamp-2">{p.title}</span>
              {p.price != null && (
                <span className="text-xs text-primary font-medium">
                  {new Intl.NumberFormat("vi-VN").format(p.price)}đ
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Số lượng */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Số lượng (con) <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-9 w-9 rounded border flex items-center justify-center hover:bg-muted transition-colors text-lg font-bold">−</button>
          <span className="w-8 text-center font-semibold">{quantity}</span>
          <button type="button" onClick={() => setQuantity(Math.min(50, quantity + 1))}
            className="h-9 w-9 rounded border flex items-center justify-center hover:bg-muted transition-colors text-lg font-bold">+</button>
        </div>
      </div>

      {/* Ngày & giờ giao */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="date">
            Ngày giao <span className="text-destructive">*</span>
          </label>
          <input
            id="date"
            type="date"
            min={today()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="time">Giờ giao</label>
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Thông tin khách */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">Thông tin liên hệ</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Tên <span className="text-destructive">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nguyễn Văn A"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="phone">
              Số điện thoại <span className="text-destructive">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="0909 123 456"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="address">Địa chỉ giao hàng</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Số nhà, đường, phường, quận..."
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Ghi chú */}
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="note">Ghi chú thêm</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Yêu cầu đặc biệt, cách trang trí, heo quay sữa đặt trước 3–5 ngày..."
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Đang gửi..." : "Xác nhận đặt lịch"}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        Sau khi đặt, chúng tôi sẽ gọi xác nhận trong vòng 30 phút.
      </p>
    </form>
  )
}
