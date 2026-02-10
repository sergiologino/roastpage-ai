import { supabase } from "./supabase"
import { RoastReport, PaymentRecord } from "./types"

export const store = {
  async getReport(id: string): Promise<RoastReport | undefined> {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) return undefined

    return {
      id: data.id,
      url: data.url,
      screenshotUrl: data.screenshot_url,
      overallScore: data.overall_score,
      summary: data.summary,
      topFixes: data.top_fixes,
      categories: data.categories,
      isPaid: data.is_paid,
      createdAt: data.created_at,
    }
  },

  async setReport(report: RoastReport): Promise<void> {
    const { error } = await supabase.from("reports").insert({
      id: report.id,
      url: report.url,
      screenshot_url: report.screenshotUrl,
      overall_score: report.overallScore,
      summary: report.summary,
      top_fixes: report.topFixes,
      categories: report.categories,
      is_paid: report.isPaid,
      created_at: report.createdAt,
    })
    if (error) console.error("Failed to save report:", error)
  },

  async updateReport(id: string, updates: Partial<RoastReport>): Promise<RoastReport | undefined> {
    const dbUpdates: any = {}
    if (updates.isPaid !== undefined) dbUpdates.is_paid = updates.isPaid
    if (updates.summary !== undefined) dbUpdates.summary = updates.summary
    if (updates.overallScore !== undefined) dbUpdates.overall_score = updates.overallScore

    const { error } = await supabase
      .from("reports")
      .update(dbUpdates)
      .eq("id", id)

    if (error) {
      console.error("Failed to update report:", error)
      return undefined
    }
    return this.getReport(id)
  },

  async setPayment(payment: PaymentRecord): Promise<void> {
    const { error } = await supabase.from("payments").insert({
      id: payment.id,
      report_id: payment.reportId,
      amount: payment.amount,
      currency: payment.currency,
      tx_hash: payment.txHash,
      status: payment.status,
      created_at: payment.createdAt,
    })
    if (error) console.error("Failed to save payment:", error)
  },

  async findPaymentByReport(reportId: string): Promise<PaymentRecord | undefined> {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("report_id", reportId)
      .eq("status", "confirmed")
      .single()

    if (error || !data) return undefined

    return {
      id: data.id,
      reportId: data.report_id,
      amount: data.amount,
      currency: data.currency,
      txHash: data.tx_hash,
      status: data.status,
      createdAt: data.created_at,
    }
  },
}