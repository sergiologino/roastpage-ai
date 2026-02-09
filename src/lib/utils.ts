export function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch { return false }
}

export function normalizeUrl(url: string): string {
  let c = url.trim()
  if (!c.startsWith("http://") && !c.startsWith("https://")) c = "https://" + c
  return c
}

export function extractDomain(url: string): string {
  try { return new URL(url).hostname } catch { return url }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e"
  if (score >= 60) return "#eab308"
  if (score >= 40) return "#f97316"
  return "#ef4444"
}

export function getGradeColor(grade: string): string {
  const c: Record<string,string> = {
    A: "bg-green-500/20 text-green-400 border-green-500/30",
    B: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    C: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    D: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    F: "bg-red-500/20 text-red-400 border-red-500/30",
  }
  return c[grade] || c.C
}
