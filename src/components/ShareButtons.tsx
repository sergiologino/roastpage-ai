"use client"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonsProps {
  score: number
  url: string
  pageUrl?: string
}

export default function ShareButtons({ score, url, pageUrl }: ShareButtonsProps) {
  const siteUrl = pageUrl || (typeof window !== "undefined" ? window.location.origin : "https://roastpage-ai.vercel.app")
  const text = `Just got my landing page roasted by AI! 🔥\nScore: ${score}/100\n\nGet yours at ${siteUrl}`
  const encodedText = encodeURIComponent(text)
  const encodedUrl = encodeURIComponent(siteUrl)

  const channels = [
    { name: "𝕏 Twitter", icon: "𝕏", href: `https://twitter.com/intent/tweet?text=${encodedText}`, color: "hover:bg-white/10" },
    { name: "LinkedIn", icon: "in", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: "hover:bg-blue-500/20" },
    { name: "Telegram", icon: "✈️", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, color: "hover:bg-sky-500/20" },
    { name: "WhatsApp", icon: "💬", href: `https://wa.me/?text=${encodedText}`, color: "hover:bg-green-500/20" },
    { name: "Reddit", icon: "🔗", href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(`My landing page scored ${score}/100 on RoastPage.ai`)}`, color: "hover:bg-orange-500/20" },
  ]

  async function copyLink() {
    await navigator.clipboard.writeText(siteUrl)
    toast.success("Link copied!")
  }

  return (
    <div className="text-center">
      <p className="text-dark-400 mb-4 text-sm">Share your roast</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {channels.map((ch) => (
          <a key={ch.name} href={ch.href} target="_blank" rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-sm font-medium transition ${ch.color}`}>
            <span>{ch.icon}</span> {ch.name}
          </a>
        ))}
        <button onClick={copyLink}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-sm font-medium transition hover:bg-white/10">
          <Share2 className="w-3.5 h-3.5" /> Copy Link
        </button>
      </div>
    </div>
  )
}