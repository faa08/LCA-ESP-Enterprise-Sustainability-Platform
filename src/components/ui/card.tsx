import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex items-start justify-between", className)} {...props} />
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-sm font-semibold text-neutral-900", className)} {...props} />
}

function CardValue({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-3xl font-bold tracking-tight text-neutral-900", className)} {...props} />
}

function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-neutral-500", className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardValue, CardDescription }
