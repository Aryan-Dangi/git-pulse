import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { GitHubRepo } from '../../types'
import { buildHeatmapData } from '../../utils/helpers'

interface Props { repos: GitHubRepo[] }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS = ['','Mon','','Wed','','Fri','']

function getLast52Weeks(): string[][] {
  const weeks: string[][] = []
  const today = new Date()
  // go back to the start of the current week's Sunday
  const startDay = new Date(today)
  startDay.setDate(today.getDate() - today.getDay() - 52 * 7)

  for (let w = 0; w < 53; w++) {
    const week: string[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDay)
      date.setDate(startDay.getDate() + w * 7 + d)
      week.push(date.toISOString().slice(0, 10))
    }
    weeks.push(week)
  }
  return weeks
}

function getColor(count: number): string {
  if (count === 0) return 'var(--bg-tertiary)'
  if (count === 1) return '#166534'
  if (count <= 3) return '#16a34a'
  if (count <= 6) return '#22c55e'
  return '#4ade80'
}

export default function ContributionHeatmap({ repos }: Props) {
  const [tooltip, setTooltip] = useState<{ date: string; count: number } | null>(null)
  const heatData = useMemo(() => buildHeatmapData(repos), [repos])
  const weeks = useMemo(() => getLast52Weeks(), [])

  const totalContributions = Object.values(heatData).reduce((a, b) => a + b, 0)

  // Get month labels
  const monthLabels: { label: string; col: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const month = new Date(week[0]).getMonth()
    if (month !== lastMonth) {
      monthLabels.push({ label: MONTHS[month], col: wi })
      lastMonth = month
    }
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }} className="card overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          Activity Heatmap
        </h3>
        <span className="stat-badge">{totalContributions} pushes · last year</span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div style={{ minWidth: 640 }}>
          {/* Month labels */}
          <div className="flex mb-1.5 ml-8">
            {monthLabels.map(({ label, col }) => (
              <div key={`${label}-${col}`}
                className="text-xs absolute"
                style={{
                  color: 'var(--text-muted)',
                  marginLeft: col * 14,
                  fontFamily: 'JetBrains Mono, monospace',
                  position: 'relative',
                  left: col * 0,
                }}>
              </div>
            ))}
            {/* simpler month row */}
            <div className="flex gap-0" style={{ marginLeft: 0 }}>
              {weeks.map((week, wi) => {
                const m = new Date(week[0]).getMonth()
                const show = wi === 0 || new Date(weeks[wi - 1][0]).getMonth() !== m
                return (
                  <div key={wi} style={{ width: 14 }}
                    className="text-xs text-center" >
                    {show ? MONTHS[m].slice(0, 3) : ''}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Grid */}
          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1.5">
              {DAYS.map((d, i) => (
                <div key={i} style={{
                  height: 11, fontSize: 9,
                  color: 'var(--text-muted)',
                  fontFamily: 'monospace',
                  lineHeight: '11px',
                  width: 20,
                  textAlign: 'right',
                  paddingRight: 4,
                }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((date, di) => {
                  const count = heatData[date] || 0
                  const isToday = date === new Date().toISOString().slice(0, 10)
                  return (
                    <div
                      key={di}
                      className="heatmap-cell relative"
                      style={{
                        backgroundColor: getColor(count),
                        outline: isToday ? '1px solid var(--accent)' : 'none',
                      }}
                      onMouseEnter={() => setTooltip({ date, count })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="mt-3 text-xs font-mono px-3 py-1.5 rounded-lg w-fit"
          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
          {tooltip.count > 0
            ? `${tooltip.count} push${tooltip.count > 1 ? 'es' : ''} on ${tooltip.date}`
            : `No activity on ${tooltip.date}`}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Less</span>
        {[0, 1, 3, 5, 7].map(n => (
          <div key={n} className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: getColor(n) }} />
        ))}
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>More</span>
      </div>
    </motion.div>
  )
}
