"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardDescription, CardHeader, CardTitle, CardValue } from "./card"
import { cn } from "@/lib/utils"
import {
  TrendingDown,
  TrendingUp,
  Minus,
  ChevronDown,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface StatCardDetail {
  formula: string
  source: string
  suggestion: string
}

interface StatCardProps {
  title: string
  value: string
  description?: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon?: LucideIcon
  trend?: "up" | "down" | "flat"
  detail?: StatCardDetail
}

const changeColors = {
  positive: "text-emerald-600",
  negative: "text-red-600",
  neutral: "text-neutral-500",
}

const trendIcons: Record<string, LucideIcon> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
}

export function StatCard({ title, value, description, change, changeType = "neutral", icon: Icon, trend, detail }: StatCardProps) {
  const TrendIcon = trend ? trendIcons[trend] : null
  const changeColor = changeColors[changeType]
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  return (
    <div ref={containerRef} className={cn("relative h-full transition-all", open ? "z-50" : "z-0 hover:z-10")}>
      <Card className={cn("group h-full", detail && "cursor-pointer")} onClick={detail ? () => setOpen(!open) : undefined}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {Icon && (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-neutral-200">
                  <Icon className="h-4 w-4" />
                </div>
              )}
              <CardTitle>{title}</CardTitle>
            </div>
            {detail && (
              <ChevronDown className={cn("h-4 w-4 text-neutral-400 transition-transform", open && "rotate-180")} />
            )}
          </div>
        </CardHeader>
        <div className="space-y-1">
          <CardValue>{value}</CardValue>
          {description && <CardDescription>{description}</CardDescription>}
          {change && (
            <div className="flex items-center gap-1 pt-1">
              {TrendIcon && <TrendIcon className={cn("h-3.5 w-3.5", changeColor)} />}
              <span className={cn("text-xs font-medium", changeColor)}>{change}</span>
            </div>
          )}
        </div>
      </Card>

      {/* ── Expandable Detail Dropdown (Absolute) ── */}
      {open && detail && (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-full min-w-[280px] space-y-2 rounded-xl border border-neutral-200 bg-white p-3 shadow-xl">
          <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-0.5">📐 Cara Perhitungan</p>
            <p className="text-[11px] text-blue-800 leading-relaxed">{detail.formula}</p>
          </div>
          <div className="rounded-lg bg-purple-50 border border-purple-100 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 mb-0.5">📊 Sumber Data</p>
            <p className="text-[11px] text-purple-800 leading-relaxed">{detail.source}</p>
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-0.5">💡 Saran Perbaikan</p>
            <p className="text-[11px] text-amber-800 leading-relaxed">{detail.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  )
}
