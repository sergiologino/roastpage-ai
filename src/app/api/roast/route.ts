import { NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { ROAST_SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts"
import { store } from "@/lib/store"
import { RoastReport, RoastCategory } from "@/lib/types"
import { isValidUrl } from "@/lib/utils"

function getScreenshotUrl(url: string): string {
  return `https://image.thum.io/get/width/1280/crop/900/noanimate/${url}`
}

async function fetchPageText(url: string): Promise<string> {
  try {
    const c = new AbortController()
    const t = setTimeout(() => c.abort(), 8000)
    const r = await fetch(url, { signal: c.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; RoastPageBot/1.0)" } })
    clearTimeout(t)
    const html = await r.text()
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim().slice(0, 4000)
  } catch { return "" }
}

async function analyzeWithAI(url: string, screenshotUrl: string, pageText: string) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error("OpenAI API key not configured")

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ROAST_SYSTEM_PROMPT },
        { role: "user", content: [
          { type: "text", text: buildUserPrompt(url, pageText) },
          { type: "image_url", image_url: { url: screenshotUrl, detail: "high" } },
        ]},
      ],
      max_tokens: 4096,
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  })

  if (!response.ok) {
    const e = await response.text()
    console.error("OpenAI error:", response.status, e)
    throw new Error(`AI analysis failed (${response.status})`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error("Empty AI response")
  return JSON.parse(content)
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    if (!url || typeof url !== "string") return NextResponse.json({ error: "URL is required" }, { status: 400 })
    if (!isValidUrl(url)) return NextResponse.json({ error: "Invalid URL" }, { status: 400 })

    const reportId = nanoid(12)
    const screenshotUrl = getScreenshotUrl(url)
    const pageText = await fetchPageText(url)
    const analysis = await analyzeWithAI(url, screenshotUrl, pageText)

    const categories: RoastCategory[] = (analysis.categories || []).map((cat: any, i: number) => ({
      name: cat.name || `Category ${i+1}`,
      icon: cat.icon || "chart",
      score: Math.min(100, Math.max(0, Math.round(cat.score || 50))),
      grade: cat.grade || "C",
      summary: cat.summary || "",
      issues: (cat.issues || []).map((is: any) => ({
        severity: is.severity || "info", title: is.title || "", description: is.description || "", fix: is.fix || "",
      })),
      recommendations: cat.recommendations || [],
      isFree: i < 2,
    }))

    const report: RoastReport = {
      id: reportId, url, screenshotUrl,
      overallScore: Math.min(100, Math.max(0, Math.round(analysis.overallScore || 50))),
      summary: analysis.summary || "Analysis complete.",
      topFixes: analysis.topFixes || [],
      categories, isPaid: false, createdAt: new Date().toISOString(),
    }
    store.setReport(report)
    return NextResponse.json({ id: reportId, status: "complete" })
  } catch (error: any) {
    console.error("Roast error:", error)
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 })
  }
}
