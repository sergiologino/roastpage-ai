"use client"
import { useState, useEffect } from "react"
import { Flame } from "lucide-react"

const stages = [
  "Taking screenshot...",
  "Scanning your page...",
  "AI is reading your copy...",
  "Analyzing design patterns...",
  "Preparing your roast...",
  "Writing recommendations...",
  "Almost done...",
]

export default function LoadingAnimation() {
  const [stage, setStage] = useState(0)
  useEffect(() => {
    const i = setInterval(() => setStage(p => (p < stages.length - 1 ? p + 1 : p)), 3000)
    return () => clearInterval(i)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <Flame className="w-16 h-16 text-orange-500 animate-flame mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">Roasting your page...</h2>
        <div className="space-y-2 mb-8">
          {stages.map((s, i) => (
            <div key={i} className={`text-sm transition-all duration-500 ${i < stage ? "text-green-400" : i === stage ? "text-white animate-pulse" : "text-dark-600"}`}>
              {i < stage ? "\u2705" : i === stage ? "\u23F3" : "\u2B1C"} {s}
            </div>
          ))}
        </div>
        <p className="text-dark-400 text-sm">This usually takes 15-30 seconds</p>
      </div>
    </div>
  )
}
