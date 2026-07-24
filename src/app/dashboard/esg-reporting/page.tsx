"use client"

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, CheckCircle2, Clock, Sparkles } from "lucide-react"

export default function ESGReportingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-primary">ESG Reporting</h1>
        <p className="mt-1 text-sm text-secondary">
          Generate and export ESG reports tailored for GRI, TCFD, CDP, and custom corporate frameworks.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted">ESG Rating Score</CardTitle>
            <p className="text-2xl font-bold text-emerald-600">A- (S&P Global)</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted">Reports Generated</CardTitle>
            <p className="text-2xl font-bold text-primary">24 YTD</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted">GRI Indicators</CardTitle>
            <p className="text-2xl font-bold text-primary">142 / 147</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted">TCFD Disclosure</CardTitle>
            <p className="text-2xl font-bold text-primary">9 / 11 Metrics</p>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Available ESG Reports</CardTitle>
            <CardDescription>Export board-ready reports in PDF or Excel format.</CardDescription>
          </div>
          <Button>
            <Sparkles className="mr-2 h-4 w-4" /> Generate New Report
          </Button>
        </CardHeader>
        <div className="p-6 pt-0 space-y-4">
          {[
            { title: "Sustainability Report 2025", framework: "GRI Standards", status: "Published", date: "Jan 2026" },
            { title: "TCFD Climate Risk Disclosure", framework: "TCFD", status: "Published", date: "Feb 2026" },
            { title: "CDP Climate Response Draft", framework: "CDP 2026", status: "Draft", date: "In Progress" },
            { title: "PROPER Self-Assessment Report", framework: "KLHK RI", status: "Ready", date: "Current" },
          ].map((report, idx) => (
            <div key={idx} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-primary">{report.title}</p>
                  <p className="text-xs text-muted">Framework: {report.framework} • Updated: {report.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={report.status === "Published" ? "success" : "neutral"}>
                  {report.status}
                </Badge>
                <Button variant="secondary" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Export PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
