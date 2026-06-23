"use client"

import { useEffect, useState } from "react"

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Mục lục
        </p>
        <nav className="space-y-1">
          {headings.map(({ id, text, level }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                setActiveId(id)
              }}
              className={[
                "block text-sm leading-snug py-1 border-l-2 transition-all duration-200",
                level === 2 ? "pl-3" : level === 3 ? "pl-6" : "pl-9",
                activeId === id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
              ].join(" ")}
            >
              {text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
