"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icons } from "@/components/icons"

interface Category {
  id: string
  name: string
  slug: string
}

interface CategorySelectorProps {
  categories: Category[]
  selected: string[]
  onChange: (ids: string[]) => void
}

export function CategorySelector({ categories, selected, onChange }: CategorySelectorProps) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  const selectedNames = categories
    .filter((c) => selected.includes(c.id))
    .map((c) => c.name)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          <Icons.post className="mr-2 h-4 w-4" />
          {selectedNames.length > 0 ? selectedNames.join(", ") : "Chọn category"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground px-2 py-1">Chưa có category.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {categories.map((cat) => {
              const isSelected = selected.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggle(cat.id)}
                  className="flex items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <span>{cat.name}</span>
                  {isSelected && <Icons.check className="h-4 w-4" />}
                </button>
              )
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
