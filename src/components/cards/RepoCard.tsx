import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { GitHubRepo } from '../../types'
import { formatNumber, timeAgo, getLanguageColor } from '../../utils/helpers'

interface Props {
  repo: GitHubRepo
  index?: number
}

export default function RepoCard({ repo, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="card group hover:border-brand-400 transition-colors duration-200 flex flex-col h-full"
      style={{ borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <Link
          to={`/repo/${repo.full_name}`}
          className="font-display font-semibold text-base truncate hover:underline"
          style={{ color: 'var(--accent)' }}>
          {repo.name}
        </Link>
        {repo.fork && (
          <span className="text-xs px-2 py-0.5 rounded-md flex-shrink-0"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
            fork
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm mt-2 leading-relaxed flex-1 line-clamp-2"
        style={{ color: 'var(--text-secondary)' }}>
        {repo.description || 'No description provided.'}
      </p>

      {/* Topics */}
      {repo.topics?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {repo.topics.slice(0, 4).map(t => (
            <span key={t} className="stat-badge">{t}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4 mt-4 pt-4 flex-wrap"
        style={{ borderTop: '1px solid var(--border)' }}>
        {repo.language && (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: getLanguageColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          {formatNumber(repo.stargazers_count)}
        </span>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/>
            <circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>
          </svg>
          {formatNumber(repo.forks_count)}
        </span>
        <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
          {timeAgo(repo.updated_at)}
        </span>
      </div>
    </motion.div>
  )
}
