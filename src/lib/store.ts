import { RoastReport, PaymentRecord } from "./types"

const g = globalThis as any
if (!g._reports) g._reports = new Map()
if (!g._payments) g._payments = new Map()

export const store = {
  getReport(id: string): RoastReport | undefined { return g._reports.get(id) },
  setReport(r: RoastReport): void { g._reports.set(r.id, r) },
  updateReport(id: string, u: Partial<RoastReport>): RoastReport | undefined {
    const e = g._reports.get(id)
    if (!e) return undefined
    const updated = { ...e, ...u }
    g._reports.set(id, updated)
    return updated
  },
  setPayment(p: PaymentRecord): void { g._payments.set(p.id, p) },
  findPaymentByReport(rid: string): PaymentRecord | undefined {
    for (const p of g._payments.values()) {
      if (p.reportId === rid && p.status === "confirmed") return p
    }
    return undefined
  },
}
