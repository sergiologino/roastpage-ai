export interface RoastReport {
  id: string
  url: string
  screenshotUrl?: string
  overallScore: number
  summary: string
  topFixes: string[]
  categories: RoastCategory[]
  isPaid: boolean
  createdAt: string
}

export interface RoastCategory {
  name: string
  icon: string
  score: number
  grade: "A" | "B" | "C" | "D" | "F"
  summary: string
  issues: RoastIssue[]
  recommendations: string[]
  isFree: boolean
}

export interface RoastIssue {
  severity: "critical" | "warning" | "info"
  title: string
  description: string
  fix: string
}

export interface PaymentRecord {
  id: string
  reportId: string
  amount: number
  currency: string
  txHash: string
  status: "pending" | "confirmed" | "failed"
  createdAt: string
}
