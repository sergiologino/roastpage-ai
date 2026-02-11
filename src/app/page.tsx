"use client"
import { useState, FormEvent } from "react"
import { motion } from "framer-motion"
import { Flame, Zap, Target, Eye, Smartphone, Brain, BarChart3, ArrowRight, Check, Star, Sparkles, Globe, ChevronDown, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { normalizeUrl, isValidUrl } from "@/lib/utils"

const features = [
  { icon: Target, title: "Headline & Value Prop", desc: "Is your message clear in 5 seconds?" },
  { icon: Eye, title: "Visual Hierarchy", desc: "Does the eye flow to your CTA?" },
  { icon: Zap, title: "CTA Analysis", desc: "Are your buttons driving action?" },
  { icon: Brain, title: "Psychology Triggers", desc: "Social proof, urgency, trust signals" },
  { icon: Smartphone, title: "Mobile Experience", desc: "Does it work on every device?" },
  { icon: BarChart3, title: "Conversion Score", desc: "Overall 0-100 conversion rating" },
]

const testimonials = [
  { name: "Alex C.", role: "Indie Hacker", text: "RoastPage found 12 issues I missed. Conversion went from 2% to 7%!", rating: 5 },
  { name: "Sarah K.", role: "Marketing Lead", text: "Better than any $500 human audit. Brutally honest and actionable.", rating: 5 },
  { name: "James R.", role: "SaaS Founder", text: "The AI caught my CTA was invisible on mobile. Obvious fix I overlooked.", rating: 5 },
]

const faqs = [
  { q: "How does it work?", a: "We screenshot your page, extract content, and use GPT-4 Vision to analyze design, copy, CTAs, and conversion patterns." },
  { q: "What do I get for free?", a: "Overall score plus 2 detailed category analyses. Full 8-category report requires a one-time payment." },
  { q: "How is this different from PageSpeed?", a: "PageSpeed measures technical performance. We analyze CONVERSION - messaging, design, CTAs, and whether visitors will take action." },
  { q: "Can I analyze competitor pages?", a: "Yes! Enter any public URL for competitive research." },
  { q: "What payment methods?", a: "USDT on Polygon network. Fast, cheap, global." },
]

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [showPromo, setShowPromo] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!url.trim()) { toast.error("Please enter a URL"); return }
    const cleanUrl = normalizeUrl(url)
    if (!isValidUrl(cleanUrl)) { toast.error("Please enter a valid URL"); return }
    setLoading(true)
    try {
      const res = await fetch("/api/roast", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: cleanUrl, promoCode }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Analysis failed")
      router.push(`/report/${data.id}`)
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-7 h-7 text-orange-500 animate-flame" />
            <span className="text-xl font-bold">RoastPage<span className="text-orange-500">.ai</span></span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/history" className="text-sm text-dark-300 hover:text-white transition">My Roasts</a><a href="#pricing" className="text-sm text-dark-300 hover:text-white transition">Pricing</a>
            <a href="#faq" className="text-sm text-dark-300 hover:text-white transition">FAQ</a>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-orange-300 mb-6">
              <Sparkles className="w-4 h-4" /> Powered by Advanced AI
            </div>
            <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-tight">
              Your landing page<br /><span className="text-gradient">needs a roast</span> {"\uD83D\uDD25"}
            </h1>
            <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto">
              AI analyzes your page and delivers <span className="text-white font-semibold">brutal, actionable feedback</span> on copy, design, CTAs, and conversion potential. In 30 seconds.
            </p>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://your-landing-page.com"
                    className="w-full pl-12 pr-4 py-4 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg" disabled={loading} />
                </div>
                <button type="submit" disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl text-white font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 glow-orange whitespace-nowrap">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Roasting...</> : <>Roast My Page <Flame className="w-5 h-5" /></>}
                </button>
              </div>
            </form>
            <div className="mt-4">
              {!showPromo ? (
                <button onClick={() => setShowPromo(true)} className="text-sm text-dark-400 hover:text-orange-400 transition">Have a promo code?</button>
              ) : (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="PROMO CODE"
                    className="px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white text-sm w-40 text-center uppercase" />
                </div>
              )}
              <p className="text-sm text-dark-400 mt-2">Free quick analysis - Full report $9.99</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 sm:gap-16">
          {[{ v: "2,847+", l: "Pages Roasted" }, { v: "+34%", l: "Avg Conversion Lift" }, { v: "4.9/5", l: "User Rating" }].map((s, i) => (
            <div key={i} className="text-center"><div className="text-3xl font-bold">{s.v}</div><div className="text-sm text-dark-400">{s.l}</div></div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">What we <span className="text-gradient">analyze</span></h2>
          <p className="text-dark-300 text-center mb-12 max-w-xl mx-auto">6 critical areas that determine whether visitors convert or bounce</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="glass-card hover:border-orange-500/30 transition-colors group cursor-default">
                <f.icon className="w-8 h-8 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-dark-300 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">What people <span className="text-gradient">say</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="glass-card">
                <div className="flex gap-1 mb-3">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-orange-500 text-orange-500" />)}</div>
                <p className="text-dark-200 mb-4 text-sm">&ldquo;{t.text}&rdquo;</p>
                <div><div className="font-semibold text-sm">{t.name}</div><div className="text-dark-400 text-xs">{t.role}</div></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 bg-dark-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Simple <span className="text-gradient">pricing</span></h2>
          <p className="text-dark-300 text-center mb-12">No subscriptions. Pay once per page.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="glass-card">
              <h3 className="text-xl font-bold mb-2">Quick Roast</h3>
              <div className="text-3xl font-black mb-4">Free</div>
              <ul className="space-y-3 mb-6">
                {["Overall conversion score", "Top 2 categories analyzed", "Basic recommendations"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-dark-200"><Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {item}</li>
                ))}
              </ul>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-full py-3 rounded-xl border border-dark-600 hover:border-dark-400 text-dark-200 font-semibold transition">Try Free</button>
            </div>
            <div className="glass-card border-orange-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-bold">BEST VALUE</div>
              <h3 className="text-xl font-bold mb-2">Full Roast</h3>
              <div className="text-3xl font-black mb-1">$9.99</div>
              <div className="text-sm text-dark-400 mb-4">per page, one-time</div>
              <ul className="space-y-3 mb-6">
                {["All 8 analysis categories", "Specific fix recommendations", "Priority-ranked action items", "Copy rewrite suggestions", "CTA & design optimization", "Psychology trigger analysis", "Competitor comparison tips"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-dark-200"><Check className="w-4 h-4 text-orange-500 flex-shrink-0" /> {item}</li>
                ))}
              </ul>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold transition glow-orange">
                Get Full Report <ArrowRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12"><span className="text-gradient">FAQ</span></h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card cursor-pointer select-none" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold pr-4">{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 text-dark-400 transition-transform flex-shrink-0 ${openFaq === i ? "rotate-180" : ""}`} />
                </div>
                {openFaq === i && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-dark-300 text-sm mt-3">{faq.a}</motion.p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to get <span className="text-gradient">roasted</span>?</h2>
          <p className="text-dark-300 mb-8">Stop guessing. Let AI tell you exactly what to fix.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white font-bold text-lg transition glow-orange">
            Roast My Page Now <Flame className="inline w-5 h-5 ml-1" />
          </button>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><Flame className="w-5 h-5 text-orange-500" /><span className="font-bold">RoastPage<span className="text-orange-500">.ai</span></span></div>
          <p className="text-sm text-dark-400">&copy; 2025 RoastPage.ai</p>
        </div>
      </footer>
    </div>
  )
}
