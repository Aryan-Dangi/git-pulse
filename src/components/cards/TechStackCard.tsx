import { motion } from 'framer-motion'
import type { TechStack } from '../../types'

interface Props { stack: TechStack }

const StackSection = ({ title, items, color }: {
  title: string; items: string[]; color: string
}) => {
  if (!items.length) return null
  return (
    <div>
      <p className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span key={item}
            className="text-xs font-medium px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}30` }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function TechStackCard({ stack }: Props) {
  const hasData = stack.frontend.length || stack.backend.length ||
    stack.languages.length || stack.tools.length

  if (!hasData) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }} className="card">
      <h3 className="font-display font-bold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>
        Tech Stack
      </h3>
      <div className="space-y-4">
        <StackSection title="// frontend" items={stack.frontend} color="#3b82f6" />
        <StackSection title="// backend" items={stack.backend} color="#10b981" />
        <StackSection title="// languages" items={stack.languages} color="var(--accent)" />
        <StackSection title="// tools & infra" items={stack.tools} color="#f59e0b" />
      </div>
    </motion.div>
  )
}
