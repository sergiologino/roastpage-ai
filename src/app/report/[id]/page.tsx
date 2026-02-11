"use client"
import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Flame, ArrowLeft, ExternalLink, Lock, Unlock, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { RoastReport } from "@/lib/types"
import { extractDomain } from "@/lib/utils"
import ScoreCircle from "@/components/ScoreCircle"
import CategoryCard from "@/components/CategoryCard"
import PaymentModal from "@/components/PaymentModal"
import LoadingAnimation from "@/components/LoadingAnimation"
import ShareButtons from "@/components/ShareButtons"

const WALLET = process.env.NEXT_PUBLIC_USDT_WALLET || ""
const PRICE = 9.99

function saveToHistory(report: RoastReport) {
  try {
    const key = "roastpage_history"
    const stored = localStorage.getItem(key)
    const history = stored ? JSON.parse(stored) : []
    const item = { id: report.id, url: report.url, score: report.overallScore, createdAt: report.createdAt }
    const updated = [item, ...history.filter((h: any) => h.id !== report.id)].slice(0, 50)
    localStorage.setItem(key, JSON.stringify(updated))
  } catch {}
}

function updateOGMeta(report: RoastReport) {
  if (typeof document === "undefined") return
  const domain = extractDomain(report.url)
  const ogImage = `https://roastpage-ai.com/api/og?score=${report.overallScore}&site=${encodeURIComponent(domain)}`
  const title = `${domain} scored ${report.overallScore}/100 on RoastPage.ai 🔥`
  const desc = report.summary

  let metaOgTitle = document.querySelector('meta[property="og:title"]')
  if (!metaOgTitle) { metaOgTitle = document.createElement("meta"); metaOgTitle.setAttribute("property", "og:title"); document.head.appendChild(metaOgTitle) }
  metaOgTitle.setAttribute("content", title)

  let metaOgDesc = document.querySelector('meta[property="og:description"]')
  if (!metaOgDesc) { metaOgDesc = document.createElement("meta"); metaOgDesc.setAttribute("property", "og:description"); document.head.appendChild(metaOgDesc) }
  metaOgDesc.setAttribute("content", desc)

  let metaOgImage = document.querySelector('meta[property="og:image"]')
  if (!metaOgImage) { metaOgImage = document.createElement("meta"); metaOgImage.setAttribute("property", "og:image"); document.head.appendChild(metaOgImage) }
  metaOgImage.setAttribute("content", ogImage)

  let metaTwImage = document.querySelector('meta[name="twitter:image"]')
  if (!metaTwImage) { metaTwImage = document.createElement("meta"); metaTwImage.setAttribute("name", "twitter:image"); document.head.appendChild(metaTwImage) }
  metaTwImage.setAttribute("content", ogImage)

  let metaTwTitle = document.querySelector('meta[name="twitter:title"]')
  if (!metaTwTitle) { metaTwTitle = document.createElement("meta"); metaTwTitle.setAttribute("name", "twitter:title"); document.head.appendChild(metaTwTitle) }
  metaTwTitle.setAttribute("content", title)

  let metaTwCard = document.querySelector('meta[name="twitter:card"]')
  if (!metaTwCard) { metaTwCard = document.createElement("meta"); metaTwCard.setAttribute("name", "twitter:card"); document.head.appendChild(metaTwCard) }
  metaTwCard.setAttribute("content", "summary_large_image")

  document.title = title
}

export default function ReportPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<RoastReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  const fetchReport = useCallback(async () => {
    try {
      const res = await fetch(`/api/report/${params.id}`)
      if (!res.ok) throw new Error("Report not found")
      const data = await res.json()
      setReport(data)
      saveToHistory(data)
      updateOGMeta(data)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }, [params.id])

  useEffect(() => { fetchReport() }, [fetchReport])

  if (loading) return <LoadingAnimation />
  if (error || !report) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-400 mb-4">{error || "Report not found"}</p>
        <Link href="/" className="text-orange-500 hover:underline">Back to home</Link>
      </div>
    </div>
  )

  const freeCategories = report.categories.filter(c => c.isFree)
  const paidCategories = report.categories.filter(c => !c.isFree)
  const hasLocked = !report.isPaid && paidCategories.length > 0

  return (
    <div className="min-h-screen pb-20">
      <nav className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-dark-300 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /><Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold hidden sm:inline">RoastPage<span className="text-orange-500">.ai</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/history" className="text-sm text-dark-400 hover:text-white transition">My Roasts</Link>
            <a href={report.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-dark-400 hover:text-white transition truncate max-w-[200px]">
              {extractDomain(report.url)} <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Roast Results 🔥</h1>
          <div className="flex justify-center mb-6"><ScoreCircle score={report.overallScore} /></div>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg mb-4">{report.summary}</p>
          {report.topFixes && report.topFixes.length > 0 && (
            <div className="glass-card text-left max-w-xl mx-auto mt-6">
              <h3 className="font-bold text-sm text-orange-400 uppercase tracking-wider mb-3">Top Priority Fixes</h3>
              <ol className="space-y-2">
                {report.topFixes.map((fix, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold">{i+1}</span>
                    <span className="text-dark-200">{fix}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {report.screenshotUrl && (
            <div className="mt-8 rounded-xl overflow-hidden border border-white/10 max-w-2xl mx-auto">
              <img src={report.screenshotUrl} alt={`Screenshot of ${extractDomain(report.url)}`} className="w-full" loading="lazy" />
            </div>
          )}
        </motion.div>

        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-bold flex items-center gap-2"><Unlock className="w-5 h-5 text-green-500" /> {report.isPaid || paidCategories.length === 0 ? "Full Analysis ⭐" : "Free Analysis"}</h2>
          {freeCategories.map((cat, i) => <CategoryCard key={i} category={cat} index={i} />)}
        </div>

        {hasLocked && (
          <div className="mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Lock className="w-5 h-5 text-dark-400" /> Locked ({paidCategories.length} more)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {paidCategories.map((cat, i) => <CategoryCard key={i} category={cat} index={i} locked />)}
            </div>
            <div className="glass-card border-orange-500/30 text-center">
              <h3 className="text-2xl font-bold mb-2">Unlock Full Roast 🔥</h3>
              <p className="text-dark-300 mb-2">Get all {report.categories.length} categories with detailed fixes</p>
              <div className="text-4xl font-black text-orange-500 mb-1">${PRICE}</div>
              <p className="text-sm text-dark-400 mb-6">One-time | USDT on Polygon</p>
              <button onClick={() => setShowPayment(true)}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl text-white font-bold text-lg transition glow-orange">
                Unlock Full Report
              </button>
            </div>
          </div>
        )}

        {report.isPaid && paidCategories.length > 0 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2"><Unlock className="w-5 h-5 text-green-500" /> Full Analysis</h2>
            {paidCategories.map((cat, i) => <CategoryCard key={i} category={cat} index={i + freeCategories.length} />)}
          </div>
        )}

        <div className="mt-12 mb-8">
          <ShareButtons score={report.overallScore} url={report.url} reportId={params.id} />
        </div>
        <div className="text-center"><Link href="/" className="text-orange-500 hover:underline text-sm">Roast another page →</Link></div>
      </div>

      {showPayment && <PaymentModal reportId={params.id} walletAddress={WALLET} price={PRICE} onSuccess={() => { setShowPayment(false); fetchReport() }} onClose={() => setShowPayment(false)} />}
    </div>
  )
}