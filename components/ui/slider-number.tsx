"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"

interface SliderNumberProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
}

export function SliderNumber({ value, onChange, min = 1, max = 100, step = 1, unit }: SliderNumberProps) {
  function handleSlider([v]: number[]) {
    onChange(v)
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseInt(e.target.value)
    if (!isNaN(v)) onChange(Math.max(min, v))
  }

  return (
    <div className="flex items-center gap-4">
      <Slider
        min={min}
        max={max}
        step={step}
        value={[Math.min(value, max)]}
        onValueChange={handleSlider}
        className="flex-1"
      />
      <div className="flex items-center gap-1.5 shrink-0">
        <Input
          type="number"
          min={min}
          value={value}
          onChange={handleInput}
          className="w-20 text-center tabular-nums"
        />
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  )
}
