export interface StatCardData {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: string
  suffix?: string
}

export interface KpiData {
  label: string
  current: number
  target: number
  unit: string
}

export interface EmissionData {
  scope: string
  category: string
  value: number
  unit: string
  period: string
}

export interface TrendDataPoint {
  period: string
  value: number
}

export interface ModuleNavItem {
  label: string
  href: string
  icon: string
}

export type Severity = "low" | "medium" | "high" | "critical"
export type ComplianceStatus = "compliant" | "non-compliant" | "pending" | "not-applicable"
