"use client"
import { motion } from "framer-motion"
import { AlertTriangle, AlertCircle, Info, Lock } from "lucide-react"
import { RoastCategory } from "@/lib/types"
import { getGradeColor } from "@/lib/utils"

function SeverityBadge({ severity }: { severity: string }) {
  const cfg: Record<string, { cls: string; Icon: any }> = {
    critical: { cls: "bg-red-500/20 text-red-400 border-red-500/30", Icon: AlertTriangle },
    warning: { cls: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", Icon: AlertCircle },
    info: { cls: "bg-blue-500/20 text-blue-400 border-blue-500/30", Icon: Info },
  }
  const { cls, Icon } = cfg[severity] || cfg.info
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border ${cls}`}>
      <Icon className="w-3 h-3" />{severity}
    </span>
  )
}

export default function CategoryCard({ category, index, locked }: { category: RoastCategory; index: number; locked?: boolean }) {
  if (locked) {
    return (
      <div className="glass-card opacity-50 relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm bg-dark-950/60 z-10 flex items-center justify-center">
          <Lock className="w-8 h-8 text-dark-400" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h3 className="font-semibold">{category.name}</h3>
            <p className="text-sm text-dark-500">Unlock to see analysis</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h3 className="font-bold text-lg">{category.name}</h3>
            <p className="text-dark-300 text-sm">{category.summary}</p>
          </div>
        </div>
        <div className={`inline-flex items-center justify-center w-10 h-10 text-lg font-black rounded-lg border ${getGradeColor(category.grade)}`}>
          {category.grade}
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-xs text-dark-400 mb-1"><span>Score</span><span>{category.score}/100</span></div>
        <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${category.score}%` }} transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
            className={`h-full rounded-full ${category.score >= 80 ? "bg-green-500" : category.score >= 60 ? "bg-yellow-500" : category.score >= 40 ? "bg-orange-500" : "bg-red-500"}`} />
        </div>
      </div>
      {category.issues.length > 0 && (
        <div className="space-y-3 mb-4">
          <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Issues Found</h4>
          {category.issues.map((issue, j) => (
            <div key={j} className="bg-dark-800/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <SeverityBadge severity={issue.severity} />
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-sm mb-1">{issue.title}</h5>
                  <p className="text-dark-300 text-sm mb-2">{issue.description}</p>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm">Fix: {issue.fix}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {category.recommendations.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Recommendations</h4>
          <ul className="space-y-2">
            {category.recommendations.map((rec, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-dark-200">
                <span className="text-orange-500 mt-0.5 flex-shrink-0">{'\u2192'}</span><span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}
