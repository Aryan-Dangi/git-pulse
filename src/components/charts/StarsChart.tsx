import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { motion } from 'framer-motion'
import type { GitHubRepo } from '../../types'

interface Props { repos: GitHubRepo[] }

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean; payload?: { value: number }[]; label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-xl shadow-lg text-sm"
      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
      <p className="font-semibold truncate max-w-[160px]">{label}</p>
      <p className="font-mono mt-0.5" style={{ color: 'var(--accent)' }}>
        ★ {payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

export default function StarsChart({ repos }: Props) {
  const data = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 8)
    .map(r => ({ name: r.name, stars: r.stargazers_count }))

  if (data.length === 0) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }} className="card">
      <h3 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
        Top Starred Repositories
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-tertiary)' }} />
          <Bar dataKey="stars" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i}
                fill={i === 0 ? 'var(--accent)' : `color-mix(in srgb, var(--accent) ${80 - i * 8}%, var(--bg-tertiary))`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
