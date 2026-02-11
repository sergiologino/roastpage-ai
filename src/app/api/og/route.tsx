import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const score = searchParams.get("score") || ""
  const site = searchParams.get("site") || ""

  if (score && site) {
    const scoreNum = Number(score)
    const color = scoreNum >= 80 ? "#22c55e" : scoreNum >= 60 ? "#eab308" : scoreNum >= 40 ? "#f97316" : "#ef4444"
    return new ImageResponse(
      (
        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#020617", fontFamily: "sans-serif" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
            <span style={{ fontSize: "48px" }}>🔥</span>
            <span style={{ fontSize: "36px", fontWeight: 800, color: "white" }}>RoastPage.ai</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "160px", height: "160px", borderRadius: "50%", border: `6px solid ${color}`, marginBottom: "20px" }}>
            <span style={{ fontSize: "64px", fontWeight: 900, color }}>{score}</span>
          </div>
          <div style={{ fontSize: "28px", color: "#94a3b8", marginBottom: "8px" }}>{site}</div>
          <div style={{ fontSize: "20px", color, fontWeight: 700 }}>Landing Page Conversion Score</div>
          <div style={{ fontSize: "16px", color: "#475569", marginTop: "20px" }}>Get your page roasted at roastpage-ai.com</div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  return new ImageResponse(
    (
      <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#020617", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <span style={{ fontSize: "48px" }}>🔥</span>
          <span style={{ fontSize: "40px", fontWeight: 800, color: "white" }}>RoastPage.ai</span>
        </div>
        <div style={{ fontSize: "24px", color: "#f97316", fontWeight: 700 }}>AI Landing Page Roaster</div>
        <div style={{ fontSize: "20px", color: "#94a3b8", marginTop: "16px" }}>Brutal, actionable feedback in 30 seconds</div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}