import { motion } from 'framer-motion'
import type { GitHubUser } from '../../types'
import { formatDate, formatNumber } from '../../utils/helpers'

interface Props {
  user: GitHubUser
  devScore: number
}

const StatPill = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col items-center justify-center p-3 rounded-xl"
    style={{ backgroundColor: 'var(--bg-tertiary)' }}>
    <span className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
      {typeof value === 'number' ? formatNumber(value) : value}
    </span>
    <span className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</span>
  </div>
)

export default function ProfileCard({ user, devScore }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }} className="card">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Avatar */}
        <a href={user.html_url} target="_blank" rel="noopener noreferrer"
          className="flex-shrink-0">
          <img src={user.avatar_url} alt={user.login}
            className="w-24 h-24 rounded-2xl ring-2 ring-brand-400 ring-offset-2 object-cover hover:opacity-90 transition-opacity" />
        </a>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="font-display font-bold text-2xl leading-tight"
                style={{ color: 'var(--text-primary)' }}>
                {user.name || user.login}
              </h2>
              <a href={user.html_url} target="_blank" rel="noopener noreferrer"
                className="text-sm font-mono hover:underline"
                style={{ color: 'var(--accent)' }}>
                @{user.login}
              </a>
            </div>
            {/* Dev Score badge */}
            <div className="flex-shrink-0 text-center px-4 py-2 rounded-xl"
              style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent)' }}>
              <div className="font-display font-bold text-lg leading-none"
                style={{ color: 'var(--accent)' }}>
                {formatNumber(devScore)}
              </div>
              <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--accent)' }}>
                DEV SCORE
              </div>
            </div>
          </div>

          {user.bio && (
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {user.bio}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mt-3">
            {user.location && (
              <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {user.location}
              </span>
            )}
            {user.blog && (
              <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs hover:underline"
                style={{ color: 'var(--text-muted)' }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                {user.blog.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            )}
            {user.twitter_username && (
              <a href={`https://twitter.com/${user.twitter_username}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs hover:underline"
                style={{ color: 'var(--text-muted)' }}>
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                @{user.twitter_username}
              </a>
            )}
            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Joined {formatDate(user.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <StatPill label="Followers" value={user.followers} />
        <StatPill label="Following" value={user.following} />
        <StatPill label="Repos" value={user.public_repos} />
        <StatPill label="Gists" value={user.public_gists} />
      </div>
    </motion.div>
  )
}
