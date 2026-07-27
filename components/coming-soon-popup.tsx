"use client"

import * as React from "react"

interface Props {
  siteName?: string
  logoUrl?: string
  siteDescription?: string
  contactPhone?: string
  contactZalo?: string
  socialFacebook?: string
}

export function ComingSoonPopup({
  siteName = "Heo Quay Bình Tân",
  logoUrl,
  siteDescription,
  contactPhone,
  contactZalo,
  socialFacebook,
}: Props) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    // Chỉ show nếu chưa đóng trong session này
    if (!sessionStorage.getItem("coming_soon_closed")) {
      setOpen(true)
    }
  }, [])

  function close() {
    sessionStorage.setItem("coming_soon_closed", "1")
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Đóng"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Background */}
        <div className="bg-[#1a0a00] px-8 py-10 flex flex-col items-center text-center">
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 30%, #c8410a 0%, transparent 55%),
                                radial-gradient(circle at 70% 70%, #8b2500 0%, transparent 55%)`,
            }}
          />

          {/* Logo */}
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={siteName}
              className="relative h-20 w-20 rounded-full object-cover border-4 border-orange-500/40 shadow-xl mb-5"
            />
          ) : (
            <div className="relative h-20 w-20 rounded-full bg-orange-700/30 border-4 border-orange-500/40 flex items-center justify-center text-3xl mb-5">
              🐷
            </div>
          )}

          {/* Site name */}
          <h2 className="relative text-2xl font-bold text-white mb-1">{siteName}</h2>

          {/* Badge */}
          <div className="relative flex items-center gap-2 my-3">
            <div className="h-px w-8 bg-orange-500/50" />
            <span className="text-orange-400 text-[10px] font-semibold uppercase tracking-[0.2em]">Sắp Ra Mắt</span>
            <div className="h-px w-8 bg-orange-500/50" />
          </div>

          {/* Description */}
          <p className="relative text-white/60 text-sm leading-relaxed mb-7">
            {siteDescription || "Website đang được hoàn thiện. Chúng tôi sẽ sớm trở lại với những điều tuyệt vời nhất!"}
          </p>

          {/* Buttons */}
          {(contactPhone || contactZalo || socialFacebook) && (
            <div className="relative flex flex-wrap items-center justify-center gap-2 mb-6">
              {contactPhone && (
                <a
                  href={`tel:${contactPhone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
                  </svg>
                  {contactPhone}
                </a>
              )}
              {contactZalo && (
                <a
                  href={`https://zalo.me/${contactZalo.replace(/\s/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0068FF] hover:bg-[#0050CC] text-white text-sm font-bold transition-colors"
                >
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                    <path d="M10 1C5.03 1 1 4.582 1 9c0 2.418 1.185 4.575 3.043 6.016L3.5 18.5l3.9-2c.84.32 1.74.5 2.6.5 4.97 0 9-3.582 9-8S14.97 1 10 1z" />
                  </svg>
                  Zalo
                </a>
              )}
              {socialFacebook && (
                <a
                  href={socialFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1877F2] hover:bg-[#0f6cd1] text-white text-sm font-bold transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              )}
            </div>
          )}

          {/* Close text button */}
          <button
            type="button"
            onClick={close}
            className="relative text-white/40 hover:text-white/70 text-xs transition-colors"
          >
            Xem trang web →
          </button>
        </div>
      </div>
    </div>
  )
}
