import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const score = searchParams.get("score") || "?"
  const url = searchParams.get("url") || "Your Landing Page"

  return new ImageResponse(
    (
      <div style={{
        height: "100%", width: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        backgroundColor: "#020617", color: "white", fontFamily: "sans-serif",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <span style={{ fontSize: "48px" }}>🔥</span>
          <span style={{ fontSize: "40px", fontWeight: 800 }}>RoastPage.ai</span>
        </div>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "180px", height: "180px", borderRadius: "50%",
          border: `8px solid ${Number(score) >= 70 ? "#22c55e" : Number(score) >= 40 ? "#f97316" : "#ef4444"}`,
          fontSize: "72px", fontWeight: 900, marginBottom: "20px",
        }}>
          {score}
        </div>
        <div style={{ fontSize: "24px", color: "#94a3b8", maxWidth: "500px", textAlign: "center" }}>
          {url}
        </div>
        <div style={{ fontSize: "20px", color: "#f97316", marginTop: "16px", fontWeight: 700 }}>
          Get your landing page roasted by AI
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}