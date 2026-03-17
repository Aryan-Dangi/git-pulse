import { motion } from 'framer-motion'
import type { DevScore } from '../../types'
import { formatNumber } from '../../utils/helpers'

interface Props { score: DevScore }

const ScoreBar = ({ label, value, total, color }: {
  label: string; value: number; total: number; color: string
}) => {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{formatNumber(value)} pts</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

const LEVEL_COLORS: Record<string, string> = {
  'Legendary Developer': '#f59e0b',
  'Open Source Pro': '#8b5cf6',
  'Rising Developer': '#3b82f6',
  'Active Contributor': '#10b981',
  'Beginner': 'var(--text-muted)',
}

export default function DevScoreCard({ score }: Props) {
  const { total, level, breakdown } = score
  const max = Math.max(...Object.values(breakdown), 1)
  const levelColor = LEVEL_COLORS[level] ?? 'var(--text-muted)'

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }} className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          Developer Score
        </h3>
        <div className="text-right">
          <div className="font-display font-bold text-3xl leading-none"
            style={{ color: 'var(--accent)' }}>
            {formatNumber(total)}
          </div>
          <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
            total points
          </div>
        </div>
      </div>

      {/* Level badge */}
      <div className="mb-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
        style={{ backgroundColor: `${levelColor}18`, color: levelColor, border: `1px solid ${levelColor}30` }}>
        <span>⚡</span> {level}
      </div>

      <div className="space-y-4">
        <ScoreBar label="Stars × 2" value={breakdown.stars} total={max} color="#f59e0b" />
        <ScoreBar label="Forks × 1.5" value={breakdown.forks} total={max} color="#3b82f6" />
        <ScoreBar label="Followers × 2" value={breakdown.followers} total={max} color="#8b5cf6" />
        <ScoreBar label="Repos × 1" value={breakdown.repos} total={max} color="#10b981" />
      </div>

      <p className="text-xs mt-5 font-mono p-3 rounded-xl"
        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
        Score = (Stars×2) + (Forks×1.5) + (Repos×1) + (Followers×2)
      </p>
    </motion.div>
  )
}
