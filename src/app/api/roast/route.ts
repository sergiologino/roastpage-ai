import { NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { ROAST_SYSTEM_PROMPT, ROAST_SYSTEM_PROMPT_PRO, buildUserPrompt, buildUserPromptPro } from "@/lib/prompts"
import { store } from "@/lib/store"
import { RoastReport, RoastCategory } from "@/lib/types"
import { isValidUrl } from "@/lib/utils"

const PROMO_CODES: Record<string, number> = {
  "LAUNCH2025": 10,
  "ROASTME": 5,
  "PRODUCTHUNT": 20,
  "FRIEND": 3,
}

const promoUsage: Record<string, number> = {}

function validatePromo(code: string): boolean {
  if (!code) return false
  const upper = code.toUpperCase()
  const limit = PROMO_CODES[upper]
  if (!limit) return false
  const used = promoUsage[upper] || 0
  if (used >= limit) return false
  promoUsage[upper] = used + 1
  return true
}

async function checkUrlExists(url: string): Promise<boolean> {
  try {
    const c = new AbortController()
    const t = setTimeout(() => c.abort(), 10000)
    const r = await fetch(url, { method: "GET", signal: c.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; RoastPageBot/1.0)" }, redirect: "follow" })
    clearTimeout(t)
    return r.ok
  } catch { return false }
}

async function getScreenshotBase64(url: string): Promise<string | null> {
  try {
    const screenshotUrl = `https://image.thum.io/get/width/1280/crop/900/noanimate/${url}`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    const res = await fetch(screenshotUrl, { signal: controller.signal })
    clearTimeout(timeout)
    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    return `data:image/png;base64,${Buffer.from(buffer).toString("base64")}`
  } catch { return null }
}

async function fetchPageText(url: string): Promise<string> {
  try {
    const c = new AbortController()
    const t = setTimeout(() => c.abort(), 8000)
    const r = await fetch(url, { signal: c.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; RoastPageBot/1.0)" } })
    clearTimeout(t)
    const html = await r.text()
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 5000)
  } catch { return "" }
}

async function analyzeWithAI(url: string, screenshotBase64: string | null, pageText: string, isPro: boolean) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error("OpenAI API key not configured")
  const model = isPro ? "gpt-4o" : "gpt-4o-mini"
  const systemPrompt = isPro ? ROAST_SYSTEM_PROMPT_PRO : ROAST_SYSTEM_PROMPT
  const userPrompt = isPro ? buildUserPromptPro(url, pageText) : buildUserPrompt(url, pageText)
  const userContent: any[] = [{ type: "text", text: userPrompt }]
  if (screenshotBase64) userContent.push({ type: "image_url", image_url: { url: screenshotBase64, detail: isPro ? "high" : "low" } })

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userContent }], max_tokens: isPro ? 4096 : 3000, temperature: 0.7, response_format: { type: "json_object" } }),
  })
  if (!response.ok) throw new Error("AI analysis failed. Please try again.")
  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error("AI analysis failed. Please try again.")
  try { return JSON.parse(content) } catch { throw new Error("AI returned invalid response.") }
}

export async function POST(request: NextRequest) {
  try {
    const { url, pro, promoCode } = await request.json()
    if (!url || typeof url !== "string") return NextResponse.json({ error: "URL is required" }, { status: 400 })
    if (!isValidUrl(url)) return NextResponse.json({ error: "Please enter a valid URL" }, { status: 400 })

    const exists = await checkUrlExists(url)
    if (!exists) return NextResponse.json({ error: "Website not reachable. Check the URL." }, { status: 400 })

    const isPromo = promoCode ? validatePromo(promoCode) : false
    const reportId = nanoid(12)
    const screenshotDisplayUrl = `https://image.thum.io/get/width/1280/crop/900/noanimate/${url}`

    const [screenshotBase64, pageText] = await Promise.all([getScreenshotBase64(url), fetchPageText(url)])
    if (!screenshotBase64 && !pageText) return NextResponse.json({ error: "Could not load page." }, { status: 400 })

    const analysis = await analyzeWithAI(url, screenshotBase64, pageText, isPromo || !!pro)
    if (!analysis.categories || !Array.isArray(analysis.categories)) return NextResponse.json({ error: "AI could not analyze." }, { status: 500 })

    const categories: RoastCategory[] = analysis.categories.map((cat: any, i: number) => ({
      name: cat.name || `Category ${i+1}`, icon: cat.icon || "chart",
      score: Math.min(100, Math.max(0, Math.round(cat.score || 50))), grade: cat.grade || "C",
      summary: cat.summary || "",
      issues: (cat.issues || []).map((is: any) => ({ severity: is.severity || "info", title: is.title || "", description: is.description || "", fix: is.fix || "" })),
      recommendations: cat.recommendations || [],
      isFree: isPromo ? true : i < 2,
    }))

    const report: RoastReport = {
      id: reportId, url, screenshotUrl: screenshotDisplayUrl,
      overallScore: Math.min(100, Math.max(0, Math.round(analysis.overallScore || 50))),
      summary: analysis.summary || "Analysis complete.",
      topFixes: analysis.topFixes || [],
      categories, isPaid: isPromo, createdAt: new Date().toISOString(),
    }
    await store.setReport(report)
    return NextResponse.json({ id: reportId, status: "complete", promo: isPromo })
  } catch (error: any) {
    console.error("Roast error:", error)
    return NextResponse.json({ error: error.message || "Analysis failed." }, { status: 500 })
  }
}