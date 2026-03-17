import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { aggregateLanguageBytes, getLanguageColor, formatNumber } from '../../utils/helpers'
import type { LanguageData } from '../../types'

interface Props { languages: LanguageData }

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { percentage: number } }[] }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-xl shadow-lg text-sm"
      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
      <p className="font-semibold">{payload[0].name}</p>
      <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
        {payload[0].payload.percentage}% · {formatNumber(payload[0].value)} bytes
      </p>
    </div>
  )
}

export default function RepoLanguageChart({ languages }: Props) {
  const data = aggregateLanguageBytes(languages)

  if (data.length === 0) return (
    <div className="card text-center py-10" style={{ color: 'var(--text-muted)' }}>
      No language data available
    </div>
  )

  return (
    <div className="card">
      <h3 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
        Language Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={90}
            paddingAngle={2} dataKey="value" nameKey="name">
            {data.map((entry) => (
              <Cell key={entry.name} fill={getLanguageColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8}
            formatter={(value) => (
              <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Percentage bars */}
      <div className="mt-4 space-y-2">
        {data.slice(0, 5).map(lang => (
          <div key={lang.name}>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: 'var(--text-secondary)' }}>{lang.name}</span>
              <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{lang.percentage}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${lang.percentage}%`, backgroundColor: getLanguageColor(lang.name) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
