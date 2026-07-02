"use client"

import * as React from "react"

const MESSAGES = [
  "Đang quay heo...",
  "Heo sắp chín rồi 🔥",
  "Mỡ đang chảy đây...",
  "Thơm quá trời ơi!",
  "Xin chờ một xíu...",
  "Da heo đang giòn lên...",
  "Chút xíu nữa thôi...",
]

const SMOKE_DELAYS = [0, 0.5, 1.1]

function RoastedPigSvg() {
  return (
    <svg viewBox="0 0 220 110" xmlns="http://www.w3.org/2000/svg" width="160" height="80">
      {/* Tail */}
      <path d="M 30 58 Q 18 48 22 36 Q 26 24 16 18" stroke="#8B3A0F" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 16 18 Q 10 12 16 8 Q 22 4 20 14" stroke="#8B3A0F" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Body */}
      <ellipse cx="105" cy="62" rx="78" ry="38" fill="#C45B1A" />
      {/* Body shine */}
      <ellipse cx="90" cy="48" rx="42" ry="16" fill="#E8812E" opacity="0.45" />
      <ellipse cx="75" cy="44" rx="18" ry="7" fill="white" opacity="0.12" />

      {/* Legs */}
      <rect x="48"  y="90" width="16" height="18" rx="6" fill="#9B3510" />
      <rect x="74"  y="93" width="16" height="15" rx="6" fill="#9B3510" />
      <rect x="118" y="93" width="16" height="15" rx="6" fill="#9B3510" />
      <rect x="144" y="90" width="16" height="18" rx="6" fill="#9B3510" />

      {/* Neck */}
      <ellipse cx="174" cy="63" rx="18" ry="22" fill="#C45B1A" />

      {/* Head */}
      <circle cx="184" cy="52" r="30" fill="#C45B1A" />
      {/* Head shine */}
      <ellipse cx="175" cy="40" rx="14" ry="9" fill="#E8812E" opacity="0.45" />

      {/* Ear */}
      <ellipse cx="178" cy="26" rx="11" ry="15" fill="#9B3510" transform="rotate(-15 178 26)" />
      <ellipse cx="178" cy="28" rx="7" ry="10" fill="#C45B1A" transform="rotate(-15 178 28)" />

      {/* Snout */}
      <ellipse cx="210" cy="58" rx="16" ry="12" fill="#D96B2E" />
      <circle cx="204" cy="57" r="3.5" fill="#7A2A08" />
      <circle cx="215" cy="57" r="3.5" fill="#7A2A08" />

      {/* Eye */}
      <circle cx="193" cy="44" r="5.5" fill="#1C0E08" />
      <circle cx="195" cy="42" r="1.8" fill="white" />

      {/* Smile */}
      <path d="M 203 66 Q 209 72 215 66" stroke="#7A2A08" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Apple in mouth */}
      <circle cx="214" cy="62" r="7" fill="#D42B2B" />
      <path d="M 214 55 Q 217 51 220 53" stroke="#2D6A1F" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="211" cy="60" r="1.5" fill="white" opacity="0.5" />

    </svg>
  )
}

export function FunnyLoader() {
  const [msg] = React.useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)])

  return (
    <div className="flex flex-col items-center gap-4 select-none">

      {/* Smoke */}
      <div className="flex gap-5 h-7 items-end">
        {SMOKE_DELAYS.map((delay, i) => (
          <span
            key={i}
            className="text-lg"
            style={{ animation: `smoke-rise 1.4s ease-out ${delay}s infinite` }}
          >
            💨
          </span>
        ))}
      </div>

      {/* Scene */}
      <div className="relative" style={{ width: 220, height: 170 }}>

        {/* Left stand */}
        <div style={{
          position: "absolute", left: 4, top: 52, width: 14, height: 90,
          background: "linear-gradient(180deg, #92400e, #78350f)",
          clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
          borderRadius: "0 0 4px 4px",
        }} />

        {/* Right stand */}
        <div style={{
          position: "absolute", right: 4, top: 52, width: 14, height: 90,
          background: "linear-gradient(180deg, #92400e, #78350f)",
          clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
          borderRadius: "0 0 4px 4px",
        }} />

        {/* Spit rod */}
        <div style={{
          position: "absolute", left: 4, right: 4, top: 54, height: 6,
          background: "linear-gradient(90deg, #92400e, #fbbf24 30%, #fbbf24 70%, #92400e)",
          borderRadius: 3,
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          zIndex: 2,
        }} />

        {/* Rotating pig */}
        <div style={{
          position: "absolute", left: 30, top: 18,
          animation: "roast-x 0.9s linear infinite",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
          zIndex: 3,
        }}>
          <RoastedPigSvg />
        </div>

        {/* Fire */}
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "flex-end", gap: 2 }}>
          <span style={{ fontSize: "1.25rem", animation: "flame-flicker 0.55s ease-in-out infinite", animationDelay: "0.1s" }}>🔥</span>
          <span style={{ fontSize: "1.75rem", animation: "flame-flicker 0.40s ease-in-out infinite" }}>🔥</span>
          <span style={{ fontSize: "1.5rem",  animation: "flame-flicker 0.65s ease-in-out infinite", animationDelay: "0.2s" }}>🔥</span>
          <span style={{ fontSize: "1.75rem", animation: "flame-flicker 0.45s ease-in-out infinite", animationDelay: "0.15s" }}>🔥</span>
          <span style={{ fontSize: "1.25rem", animation: "flame-flicker 0.5s ease-in-out infinite", animationDelay: "0.05s" }}>🔥</span>
        </div>
      </div>

      {/* Message */}
      <p className="text-sm font-medium text-muted-foreground tracking-wide animate-pulse font-heading">{msg}</p>
    </div>
  )
}
