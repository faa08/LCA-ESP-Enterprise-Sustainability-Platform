import { Card, CardDescription, CardHeader, CardTitle, CardValue } from "./card"
import { cn } from "@/lib/utils"
import {
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  description?: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon?: LucideIcon
  trend?: "up" | "down" | "flat"
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

export function StatCard({ title, value, description, change, changeType = "neutral", icon: Icon, trend }: StatCardProps) {
  const TrendIcon = trend ? trendIcons[trend] : null
  const changeColor = changeColors[changeType]

  return (
    <Card className="group">
      <CardHeader>
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-neutral-200">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <CardTitle>{title}</CardTitle>
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
  )
}
