import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

type BadgeVariant = "default" | "success" | "warning" | "danger" | "neutral"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-blue-50 text-blue-700 ring-blue-600/20",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  danger: "bg-red-50 text-red-700 ring-red-600/20",
  neutral: "bg-neutral-50 text-neutral-700 ring-neutral-600/20",
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  )
}
