import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { motion } from 'framer-motion'
import type { GitHubRepo } from '../../types'
import { getTopLanguages, getLanguageColor } from '../../utils/helpers'

interface Props { repos: GitHubRepo[] }

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-xl shadow-lg text-sm"
      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
      <span className="font-semibold">{payload[0].name}</span>
      <span className="ml-2 font-mono" style={{ color: 'var(--text-muted)' }}>
        {payload[0].value} repos
      </span>
    </div>
  )
}

export default function LanguageChart({ repos }: Props) {
  const langMap = getTopLanguages(repos)
  const data = Object.entries(langMap).map(([name, value]) => ({ name, value }))

  if (data.length === 0) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }} className="card">
      <h3 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
        Language Distribution
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
            paddingAngle={3} dataKey="value" nameKey="name">
            {data.map((entry) => (
              <Cell key={entry.name} fill={getLanguageColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
