"use client"
import { useState, useEffect } from "react"

interface ReportHistoryItem {
  id: string
  url: string
  score: number
  createdAt: string
}

const STORAGE_KEY = "roastpage_history"

export function useReportHistory() {
  const [history, setHistory] = useState<ReportHistoryItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  function addReport(item: ReportHistoryItem) {
    const updated = [item, ...history.filter(h => h.id !== item.id)].slice(0, 50)
    setHistory(updated)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
  }

  function clearHistory() {
    setHistory([])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  return { history, addReport, clearHistory }
}