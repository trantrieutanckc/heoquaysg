"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  title: string
  price: number | null
}

interface SelectedItem {
  id: string
  title: string
  quantity: number
}

const TIME_SLOTS = [
  "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00",
]

function tomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split("T")[0]
}

export function BookingForm({ products }: { products: Product[] }) {
  const [items, setItems] = React.useState<SelectedItem[]>([])
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [date, setDate] = React.useState("")
  const [time, setTime] = React.useState("10:00")
  const [note, setNote] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = React.useState("")
  const formLoadedAt = React.useRef(Date.now())

  function toggleProduct(product: Product) {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id)
      if (exists) return prev.filter((i) => i.id !== product.id)
      return [...prev, { id: product.id, title: product.title, quantity: 1 }]
    })
  }

  function setQty(id: string, delta: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.min(50, Math.max(1, i.quantity + delta)) } : i
      )
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) { setErrorMsg("Vui lòng chọn ít nhất 1 món."); return }
    if (!date) { setErrorMsg("Vui lòng chọn ngày giao."); return }
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, address,
          items,
          deliveryDate: `${date}T${time}:00`,
          note,
          _formLoadedAt: formLoadedAt.current,
        }),
      })
      if (res.status === 429) {
        const data = await res.json()
        setStatus("idle")
        setErrorMsg(data.error ?? "Bạn vừa gửi đơn rồi, vui lòng chờ một lúc.")
        return
      }
      if (!res.ok) throw new Error()
      setStatus("success")
    } catch {
      setStatus("error")
      setErrorMsg("Có lỗi xảy ra, vui lòng thử lại hoặc gọi điện trực tiếp.")
    }
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center space-y-4">
        <div className="flex justify-center gap-3 text-5xl">
          <span>🐷</span>
          <span>🍗</span>
          <span>🦆</span>
        </div>
        <div>
          <p className="font-heading text-xl font-semibold mb-1">Đang cập nhật thực đơn!</p>
          <p className="text-sm text-muted-foreground">
            Thực đơn đặt lịch đang được bổ sung. Trong thời gian này bạn có thể đặt hàng trực tiếp qua điện thoại — nhanh hơn và tiện hơn!
          </p>
        </div>
        <a
          href="tel:0909123456"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 7.31 7.31l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Gọi đặt hàng ngay
        </a>
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
          onClick={() => { setStatus("idle"); setItems([]); setDate(""); setNote(""); setAddress("") }}
          className="mt-2 text-sm text-primary hover:underline"
        >
          Đặt thêm đơn khác
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Chọn món — multi-select */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold">
            Chọn món <span className="text-destructive">*</span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Có thể chọn nhiều loại cùng lúc</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {products.map((p) => {
            const selected = items.find((i) => i.id === p.id)
            return (
              <div
                key={p.id}
                className={cn(
                  "rounded-lg border transition-colors",
                  selected ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                {/* Card header — click to toggle */}
                <button
                  type="button"
                  onClick={() => toggleProduct(p)}
                  className="w-full flex items-center gap-3 p-3 text-left"
                >
                  {/* Checkbox visual */}
                  <span className={cn(
                    "flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors",
                    selected ? "border-primary bg-primary" : "border-muted-foreground/30"
                  )}>
                    {selected && (
                      <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-sm leading-tight">{p.title}</span>
                    {p.price != null && (
                      <span className="text-xs text-primary font-medium">
                        {new Intl.NumberFormat("vi-VN").format(p.price)}đ/con
                      </span>
                    )}
                  </span>
                </button>

                {/* Quantity row — chỉ hiện khi được chọn */}
                {selected && (
                  <div className="flex items-center gap-3 px-3 pb-3 pt-0">
                    <span className="text-xs text-muted-foreground">Số lượng:</span>
                    <button
                      type="button"
                      onClick={() => setQty(p.id, -1)}
                      className="h-7 w-7 rounded border flex items-center justify-center hover:bg-muted transition-colors font-bold"
                    >−</button>
                    <span className="w-6 text-center text-sm font-semibold">{selected.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQty(p.id, 1)}
                      className="h-7 w-7 rounded border flex items-center justify-center hover:bg-muted transition-colors font-bold"
                    >+</button>
                    <span className="text-xs text-muted-foreground">con</span>
                  </div>
                )}
              </div>
            )
          })}
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
            min={tomorrow()}
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
