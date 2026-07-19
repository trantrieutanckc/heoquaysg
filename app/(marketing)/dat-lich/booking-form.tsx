"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useFunnyLoading } from "@/hooks/use-funny-loading"

interface Product {
  id: string
  title: string
  unit?: string
  image?: unknown
}

interface BookingFormProps {
  products: Product[]
  contactPhone?: string | null
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

function nextWeekday() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  // nếu ngày mai là thứ 7 → +1, chủ nhật → +2
  if (d.getDay() === 6) d.setDate(d.getDate() + 2)
  if (d.getDay() === 0) d.setDate(d.getDate() + 1)
  return d.toISOString().split("T")[0]
}

function isWeekend(dateStr: string) {
  const day = new Date(dateStr + "T00:00:00").getDay()
  return day === 0 || day === 6
}

const inputCls = "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
const labelCls = "block text-sm font-medium text-foreground mb-1.5"

function StepLabel({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center leading-none">
        {num}
      </span>
      <h2 className="text-base font-semibold">{children}</h2>
    </div>
  )
}

const OCCASIONS = ["Giỗ chạp", "Đám tiệc / Đám cưới", "Sinh nhật", "Liên hoan công ty", "Khác"]

export function BookingForm({ products, contactPhone }: BookingFormProps) {
  const [items, setItems] = React.useState<SelectedItem[]>([])
  const [occasion, setOccasion] = React.useState("")
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [date, setDate] = React.useState("")
  const [time, setTime] = React.useState("10:00")
  const [note, setNote] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = React.useState("")
  const formLoadedAt = React.useRef(Date.now())
  const funnyMsg = useFunnyLoading(status === "loading")

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
    if (isWeekend(date)) { setErrorMsg("Chúng tôi chỉ giao hàng Thứ 2 – Thứ 6. Vui lòng chọn ngày khác."); return }
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, address, items,
          deliveryDate: `${date}T${time}:00`,
          note: occasion ? `Dịp: ${occasion}${note ? `\n\n${note}` : ""}` : note,
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

  /* ── Empty state ──────────────────────────────────────────── */
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-12 text-center space-y-5">
        <div className="flex justify-center gap-4 text-5xl">
          <span>🐷</span><span>🍗</span><span>🦆</span>
        </div>
        <div className="space-y-1.5">
          <p className="font-heading text-xl font-semibold">Đang cập nhật thực đơn!</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Trong thời gian này bạn có thể đặt hàng trực tiếp qua điện thoại — nhanh hơn và tiện hơn!
          </p>
        </div>
        {contactPhone && (
          <a
            href={`tel:${contactPhone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 7.31 7.31l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Gọi đặt hàng ngay — {contactPhone}
          </a>
        )}
      </div>
    )
  }

  /* ── Success state ────────────────────────────────────────── */
  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 p-10 text-center space-y-4">
        <div className="mx-auto h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
          <svg className="h-7 w-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="font-heading text-2xl font-semibold text-green-800 dark:text-green-300">Đặt lịch thành công!</h2>
          <p className="text-muted-foreground text-sm mt-1.5">
            Chúng tôi đã nhận đơn và sẽ gọi điện xác nhận trong thời gian sớm nhất.
          </p>
        </div>
        <button
          onClick={() => { setStatus("idle"); setItems([]); setDate(""); setNote(""); setAddress("") }}
          className="text-sm font-medium text-primary hover:underline"
        >
          Đặt thêm đơn khác →
        </button>
      </div>
    )
  }

  /* ── Form ─────────────────────────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* 1. Chọn món */}
      <section>
        <StepLabel num="1">
          Chọn món <span className="text-destructive">*</span>
          <span className="ml-1.5 text-xs font-normal text-muted-foreground">(có thể chọn nhiều)</span>
        </StepLabel>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          {products.map((p) => {
            const selected = items.find((i) => i.id === p.id)
            const imgUrl = (p.image as { url?: string } | null)?.url ?? null
            return (
              <div
                key={p.id}
                className={cn(
                  "rounded-xl border-2 overflow-hidden transition-all duration-150 cursor-pointer group",
                  selected
                    ? "border-primary shadow-md shadow-primary/15"
                    : "border-border hover:border-primary/50"
                )}
              >
                {/* Ảnh */}
                <button
                  type="button"
                  onClick={() => toggleProduct(p)}
                  className="w-full text-left"
                >
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/30 dark:to-amber-900/20 text-4xl">
                        🐷
                      </div>
                    )}
                    {/* Selected overlay */}
                    <div className={cn(
                      "absolute inset-0 flex items-center justify-center transition-opacity",
                      selected ? "opacity-100 bg-primary/20" : "opacity-0"
                    )}>
                      <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Tên */}
                  <div className="px-3 py-2.5">
                    <p className="font-semibold text-sm leading-snug line-clamp-2">{p.title}</p>
                  </div>
                </button>

                {/* Số lượng */}
                {selected && (
                  <div className="flex items-center gap-1.5 px-3 pb-3 border-t bg-primary/5">
                    <span className="text-xs text-muted-foreground flex-1 pt-2">Số lượng</span>
                    <div className="flex items-center gap-1.5 pt-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setQty(p.id, -1) }}
                        className="h-7 w-7 rounded-lg border bg-background flex items-center justify-center hover:bg-muted transition-colors text-base font-bold leading-none"
                      >−</button>
                      <span className="w-7 text-center text-sm font-bold tabular-nums">{selected.quantity}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setQty(p.id, 1) }}
                        className="h-7 w-7 rounded-lg border bg-background flex items-center justify-center hover:bg-muted transition-colors text-base font-bold leading-none"
                      >+</button>
                      <span className="text-xs text-muted-foreground ml-0.5">{p.unit ?? "con"}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 2. Dịp sự kiện */}
      <section>
        <StepLabel num="2">Dịp sự kiện</StepLabel>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOccasion(occasion === o ? "" : o)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                occasion === o
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/60 hover:text-primary"
              )}
            >
              {o}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Thời gian */}
      <section>
        <StepLabel num="3">Thời gian giao hàng</StepLabel>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} htmlFor="date">
              Ngày giao <span className="text-destructive">*</span>
            </label>
            <input
              id="date"
              type="date"
              min={nextWeekday()}
              value={date}
              onChange={(e) => {
                const v = e.target.value
                if (isWeekend(v)) {
                  setErrorMsg("Chúng tôi chỉ giao hàng Thứ 2 – Thứ 6. Vui lòng chọn ngày khác.")
                  setDate("")
                } else {
                  setErrorMsg("")
                  setDate(v)
                }
              }}
              required
              className={inputCls}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">Giao hàng Thứ 2 – Thứ 6 (không giao T7, CN)</p>
          </div>
          <div>
            <label className={labelCls} htmlFor="time">Giờ giao</label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputCls}
            >
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 4. Thông tin liên hệ */}
      <section>
        <StepLabel num="4">Thông tin liên hệ</StepLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="name">
              Họ tên <span className="text-destructive">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nguyễn Văn A"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="phone">
              Số điện thoại <span className="text-destructive">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="0909 123 456"
              className={inputCls}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelCls} htmlFor="address">Địa chỉ giao hàng</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Số nhà, đường, phường, quận..."
            className={inputCls}
          />
        </div>
      </section>

      {/* 5. Ghi chú */}
      <section>
        <StepLabel num="5">Ghi chú thêm</StepLabel>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Yêu cầu đặc biệt, cách trình bày, heo quay sữa cần đặt trước 3–5 ngày..."
          className={cn(inputCls, "resize-none")}
        />
      </section>

      {/* Order summary */}
      {items.length > 0 && (
        <section className="rounded-xl bg-muted/50 border p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tóm tắt đơn hàng</p>
          {items.map((item) => {
            const product = products.find((p) => p.id === item.id)
            return (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{item.title}</span>
                <span className="font-medium text-muted-foreground">
                  {item.quantity} {product?.unit ?? "con"}
                </span>
              </div>
            )
          })}
          {date && (
            <p className="text-xs text-muted-foreground pt-1">
              Giao lúc <span className="font-medium text-foreground">{time} ngày {date.split("-").reverse().join("/")}</span>
            </p>
          )}
        </section>
      )}

      {/* Error */}
      {errorMsg && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
          <p className="text-sm text-destructive font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Submit */}
      <div className="space-y-3 pt-1">
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-60"
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              {funnyMsg}
            </span>
          ) : "Xác nhận đặt lịch"}
        </button>
        <p className="text-xs text-muted-foreground text-center">
          Chúng tôi sẽ liên hệ lại trong vòng 2 giờ để xác nhận đơn và báo giá.
        </p>
      </div>

    </form>
  )
}
