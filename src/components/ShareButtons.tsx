"use client"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

export default function ShareButtons({ score, url }: { score: number; url: string }) {
  const siteUrl = typeof window !== "undefined" ? window.location.href : "https://roastpage-ai.com"
  const domain = (() => { try { return new URL(url).hostname } catch { return url } })()
  const ogImage = `https://roastpage-ai.com/api/og?score=${score}&site=${encodeURIComponent(domain)}`
  const text = `My landing page scored ${score}/100 on RoastPage.ai! 🔥\n\nGet yours roasted:`

  const channels = [
    { name: "𝕏 Twitter", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent("https://roastpage-ai.com")}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://roastpage-ai.com")}` },
    { name: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent("https://roastpage-ai.com")}&text=${encodeURIComponent(text)}` },
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(text + " https://roastpage-ai.com")}` },
    { name: "Reddit", href: `https://reddit.com/submit?url=${encodeURIComponent("https://roastpage-ai.com")}&title=${encodeURIComponent(`My landing page scored ${score}/100 on RoastPage.ai`)}` },
  ]

  async function copyLink() { await navigator.clipboard.writeText(siteUrl); toast.success("Link copied!") }

  return (
    <div className="text-center">
      <p className="text-dark-400 mb-4 text-sm">Share your roast</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {channels.map(ch => (
          <a key={ch.name} href={ch.href} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-sm font-medium transition hover:bg-white/10">
            {ch.name}
          </a>
        ))}
        <button onClick={copyLink} className="inline-flex items-center gap-2 px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-sm font-medium transition hover:bg-white/10">
          <Share2 className="w-3.5 h-3.5" /> Copy Link
        </button>
      </div>
    </div>
  )
}