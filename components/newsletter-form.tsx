"use client"

import * as React from "react"

export function NewsletterForm() {
  const [email, setEmail] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")
  const [msg, setMsg] = React.useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus("loading")
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus("success")
        setMsg("Đăng ký thành công! Cảm ơn bạn.")
        setEmail("")
      } else {
        setStatus("error")
        setMsg(data.error ?? "Có lỗi xảy ra, thử lại sau.")
      }
    } catch {
      setStatus("error")
      setMsg("Có lỗi xảy ra, thử lại sau.")
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-green-400 font-medium">{msg}</p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-xs">
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="flex-1 min-w-0 bg-stone-800 border border-stone-700 text-stone-100 placeholder:text-stone-500 text-sm px-3 py-2 focus:outline-none focus:border-primary transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 py-2 transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "..." : "Đăng ký"}
        </button>
      </div>
      {status === "error" && <p className="text-xs text-red-400">{msg}</p>}
    </form>
  )
}
