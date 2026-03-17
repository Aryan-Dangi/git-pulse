import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRepo, useRepoLanguages } from '../../hooks/useGitHub'
import RepoLanguageChart from '../../components/charts/RepoLanguageChart'
import { formatDate, formatNumber } from '../../utils/helpers'
import { ChartSkeleton } from '../../components/ui/Skeletons'

export default function RepoDetailsPage() {
  const { owner = '', repo = '' } = useParams<{ owner: string; repo: string }>()

  const { data: repoData, isLoading, error } = useRepo(owner, repo)
  const { data: languages = {}, isLoading: langLoading } = useRepoLanguages(owner, repo)

  if (error) return (
    <div className="page-container text-center py-20">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="font-display font-bold text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>
        Repository not found
      </h2>
      <Link to="/" className="btn-primary">← Back to Home</Link>
    </div>
  )

  if (isLoading) return (
    <div className="page-container space-y-6">
      <div className="skeleton h-8 w-64 rounded-xl" />
      <div className="card animate-pulse space-y-4">
        <div className="skeleton h-6 w-48" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="grid grid-cols-4 gap-4 pt-2">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      </div>
      <ChartSkeleton />
    </div>
  )

  if (!repoData) return null

  const stats = [
    { label: 'Stars', value: repoData.stargazers_count, icon: '⭐' },
    { label: 'Forks', value: repoData.forks_count, icon: '🔀' },
    { label: 'Open Issues', value: repoData.open_issues_count, icon: '🐛' },
    { label: 'Watchers', value: repoData.watchers_count, icon: '👀' },
  ]

  return (
    <div className="page-container space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link to={`/profile/${owner}`} className="hover:underline" style={{ color: 'var(--accent)' }}>
          {owner}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{repo}</span>
      </div>

      {/* Main card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
              {repoData.name}
            </h1>
            <a href={repoData.html_url} target="_blank" rel="noopener noreferrer"
              className="text-sm font-mono hover:underline mt-1 inline-block"
              style={{ color: 'var(--accent)' }}>
              {repoData.full_name} ↗
            </a>
          </div>
          <div className="flex gap-2 flex-wrap">
            {repoData.topics?.slice(0, 5).map(t => (
              <span key={t} className="stat-badge">{t}</span>
            ))}
          </div>
        </div>

        {repoData.description && (
          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {repoData.description}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {stats.map(s => (
            <div key={s.label} className="p-4 rounded-xl text-center"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                {formatNumber(s.value)}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-6 mt-6 pt-6 text-sm"
          style={{ borderTop: '1px solid var(--border)' }}>
          {repoData.language && (
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Language: </span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {repoData.language}
              </span>
            </div>
          )}
          {repoData.license && (
            <div>
              <span style={{ color: 'var(--text-muted)' }}>License: </span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {repoData.license.name}
              </span>
            </div>
          )}
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Created: </span>
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {formatDate(repoData.created_at)}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Updated: </span>
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {formatDate(repoData.updated_at)}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Size: </span>
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {repoData.size > 1024 ? `${(repoData.size / 1024).toFixed(1)} MB` : `${repoData.size} KB`}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Language chart */}
      {langLoading ? <ChartSkeleton /> : Object.keys(languages).length > 0 && (
        <RepoLanguageChart languages={languages} />
      )}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <a href={repoData.html_url} target="_blank" rel="noopener noreferrer"
          className="btn-primary flex items-center gap-2">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57
              0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695
              -.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99
              .105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225
              -.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405
              c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225
              0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3
              0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          View on GitHub
        </a>
        <Link to={`/profile/${owner}`} className="btn-secondary">
          ← Back to {owner}'s Profile
        </Link>
      </div>
    </div>
  )
}
