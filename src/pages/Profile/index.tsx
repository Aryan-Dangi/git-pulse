import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGitHubUser, useGitHubRepos } from '../../hooks/useGitHub'
import { calculateDevScore, detectTechStack, formatNumber } from '../../utils/helpers'
import ProfileCard from '../../components/cards/ProfileCard'
import DevScoreCard from '../../components/cards/DevScoreCard'
import TechStackCard from '../../components/cards/TechStackCard'
import RepoCard from '../../components/cards/RepoCard'
import LanguageChart from '../../components/charts/LanguageChart'
import StarsChart from '../../components/charts/StarsChart'
import ContributionHeatmap from '../../components/charts/ContributionHeatmap'
import { ProfileCardSkeleton, RepoCardSkeleton, ChartSkeleton, StatCardSkeleton } from '../../components/ui/Skeletons'
import type { SortOption } from '../../types'

type Tab = 'repos' | 'analytics' | 'activity'

export default function ProfilePage() {
  const { username = '' } = useParams<{ username: string }>()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('stars')
  const [tab, setTab] = useState<Tab>('repos')
  const [langFilter, setLangFilter] = useState('')
  const [copied, setCopied] = useState(false)

  const { data: user, isLoading: userLoading, error: userError } = useGitHubUser(username)
  const { data: repos = [], isLoading: reposLoading } = useGitHubRepos(username)

  const devScore = useMemo(() =>
    user && repos.length ? calculateDevScore(repos, user.followers) : null,
    [user, repos]
  )
  const techStack = useMemo(() => detectTechStack(repos), [repos])
  const ownRepos = useMemo(() => repos.filter(r => !r.fork), [repos])
  const totalStars = ownRepos.reduce((a, r) => a + r.stargazers_count, 0)
  const totalForks = ownRepos.reduce((a, r) => a + r.forks_count, 0)
  const languages = useMemo(() =>
    [...new Set(repos.map(r => r.language).filter(Boolean) as string[])].sort(), [repos])

  const filteredRepos = useMemo(() => {
    let r = ownRepos
    if (search) r = r.filter(repo =>
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      repo.description?.toLowerCase().includes(search.toLowerCase()))
    if (langFilter) r = r.filter(repo => repo.language === langFilter)
    return [...r].sort((a, b) => {
      if (sort === 'stars') return b.stargazers_count - a.stargazers_count
      if (sort === 'forks') return b.forks_count - a.forks_count
      if (sort === 'updated') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      return a.name.localeCompare(b.name)
    })
  }, [ownRepos, search, sort, langFilter])

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (userError) return (
    <div className="page-container text-center py-20">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
        User not found
      </h2>
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
        No GitHub user found for <span className="font-mono">{username}</span>
      </p>
      <Link to="/" className="btn-primary">← Back to Home</Link>
    </div>
  )

  const TABS: { key: Tab; label: string }[] = [
    { key: 'repos', label: '📦 Repositories' },
    { key: 'analytics', label: '📊 Analytics' },
    { key: 'activity', label: '🔥 Activity' },
  ]

  return (
    <div className="page-container space-y-6">
      {userLoading ? <ProfileCardSkeleton /> : user && devScore && (
        <ProfileCard user={user} devScore={devScore.total} />
      )}

      {/* Shareable link */}
      {user && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent)' }}>
          <svg width="13" height="13" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <span className="font-mono text-xs flex-1 truncate" style={{ color: 'var(--accent)' }}>
            {window.location.href}
          </span>
          <button onClick={handleCopy}
            className="text-xs px-3 py-1 rounded-lg font-medium transition-all flex-shrink-0"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
            {copied ? '✓ Copied!' : 'Share'}
          </button>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {reposLoading
          ? [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          : [
              { label: 'Total Stars', value: formatNumber(totalStars), icon: '⭐' },
              { label: 'Total Forks', value: formatNumber(totalForks), icon: '🔀' },
              { label: 'Own Repos', value: ownRepos.length, icon: '📦' },
              { label: 'Languages', value: languages.length, icon: '🌐' },
            ].map((stat, i) => (
              <motion.div key={stat.label}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }} className="card">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
                  {stat.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
              </motion.div>
            ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded-lg text-sm font-display font-medium transition-all"
            style={{
              backgroundColor: tab === t.key ? 'var(--bg-secondary)' : 'transparent',
              color: tab === t.key ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: tab === t.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {tab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reposLoading ? <><ChartSkeleton /><ChartSkeleton /></> : <>
            {repos.length > 0 && <LanguageChart repos={repos} />}
            {repos.length > 0 && <StarsChart repos={repos} />}
            {devScore && <DevScoreCard score={devScore} />}
            <TechStackCard stack={techStack} />
          </>}
        </div>
      )}

      {/* Activity Tab */}
      {tab === 'activity' && (
        <div className="space-y-6">
          {reposLoading ? <ChartSkeleton /> : <ContributionHeatmap repos={repos} />}
          {!reposLoading && (
            <div className="card">
              <h3 className="font-display font-bold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>
                Recent Pushes
              </h3>
              <div className="space-y-0">
                {[...repos]
                  .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
                  .slice(0, 12)
                  .map((repo, i, arr) => (
                    <motion.div key={repo.id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-4 py-3"
                      style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                      <Link to={`/repo/${repo.full_name}`}
                        className="font-medium text-sm hover:underline flex-1 truncate"
                        style={{ color: 'var(--accent)' }}>
                        {repo.name}
                      </Link>
                      {repo.language && (
                        <span className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                          {repo.language}
                        </span>
                      )}
                      <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                        {new Date(repo.pushed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                      </span>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Repos Tab */}
      {tab === 'repos' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--text-muted)' }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search repositories..." className="input-field pl-10" />
            </div>
            <select value={langFilter} onChange={e => setLangFilter(e.target.value)}
              className="input-field w-full sm:w-44" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <option value="">All Languages</option>
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value as SortOption)}
              className="input-field w-full sm:w-44" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <option value="stars">⭐ Stars</option>
              <option value="forks">🔀 Forks</option>
              <option value="updated">🕒 Updated</option>
              <option value="name">🔤 Name</option>
            </select>
          </div>
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {filteredRepos.length} repositor{filteredRepos.length !== 1 ? 'ies' : 'y'}
          </p>
          {reposLoading
            ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <RepoCardSkeleton key={i} />)}
              </div>
            : filteredRepos.length === 0
              ? <div className="card text-center py-12" style={{ color: 'var(--text-muted)' }}>
                  No repositories match your filters
                </div>
              : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRepos.map((repo, i) => (
                    <RepoCard key={repo.id} repo={repo} index={i} />
                  ))}
                </div>
          }
        </>
      )}
    </div>
  )
}
