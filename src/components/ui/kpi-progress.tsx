import { cn } from "@/lib/utils"

interface KpiProgressProps {
  label: string
  current: number
  target: number
  unit: string
}

export function KpiProgress({ label, current, target, unit }: KpiProgressProps) {
  const percentage = Math.min(Math.round((current / target) * 100), 100)
  const isOverTarget = current > target
  const isAtTarget = current >= target * 0.95 && current <= target * 1.05

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-600">{label}</span>
        <span className="text-sm font-medium text-neutral-900">
          {current.toLocaleString("en-US")}/{target.toLocaleString("en-US")} {unit}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isOverTarget ? "bg-red-500" : isAtTarget ? "bg-emerald-500" : "bg-amber-500",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-xs text-neutral-500">{percentage}% of target</span>
      </div>
    </div>
  )
}
