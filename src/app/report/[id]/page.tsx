import { Metadata } from "next"
import ReportClient from "./ReportClient"

type Props = { params: { id: string } }

async function getReport(id: string) {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://roastpage-ai.com"
    const res = await fetch(`${baseUrl}/api/report/${id}`, { cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const report = await getReport(params.id)
  if (!report) return { title: "RoastPage.ai" }

  let domain = "unknown"
  try { domain = new URL(report.url).hostname } catch {}

  const ogImage = `https://roastpage-ai.com/api/og?score=${report.overallScore}&site=${encodeURIComponent(domain)}`
  const title = `${domain} scored ${report.overallScore}/100 on RoastPage.ai`
  const description = report.summary || `AI landing page analysis for ${domain}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://roastpage-ai.com/report/${params.id}`,
      siteName: "RoastPage.ai",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function ReportPage({ params }: Props) {
  return <ReportClient id={params.id} />
}
