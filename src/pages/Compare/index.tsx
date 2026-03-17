import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGitHubUser, useGitHubRepos } from '../../hooks/useGitHub'
import { calculateDevScore, formatNumber, getTopLanguages } from '../../utils/helpers'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'

const UserInput = ({ label, value, onChange, onSearch, loading }: {
  label: string; value: string; onChange: (v: string) => void;
  onSearch: () => void; loading: boolean
}) => (
  <div className="flex-1">
    <label className="block text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>
      {label}
    </label>
    <div className="flex gap-2">
      <input value={value} onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSearch()}
        placeholder="GitHub username..."
        className="input-field flex-1" />
      <button onClick={onSearch} disabled={!value.trim() || loading}
        className="btn-primary px-4 disabled:opacity-50">
        {loading ? '...' : 'Load'}
      </button>
    </div>
  </div>
)

const Avatar = ({ login, name, avatar }: { login: string; name: string | null; avatar: string }) => (
  <div className="flex items-center gap-3">
    <img src={avatar} alt={login} className="w-12 h-12 rounded-xl object-cover" />
    <div>
      <p className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
        {name || login}
      </p>
      <p className="text-xs font-mono" style={{ color: 'var(--accent)' }}>@{login}</p>
    </div>
  </div>
)

const CompareRow = ({ label, v1, v2 }: { label: string; v1: number; v2: number }) => {
  const max = Math.max(v1, v2, 1)
  const pct1 = (v1 / max) * 100
  const pct2 = (v2 / max) * 100
  const winner = v1 > v2 ? 1 : v2 > v1 ? 2 : 0
  return (
    <div className="py-3" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex justify-between items-center mb-2">
        <span className={`font-mono text-sm font-medium ${winner === 1 ? '' : ''}`}
          style={{ color: winner === 1 ? 'var(--accent)' : 'var(--text-primary)' }}>
          {formatNumber(v1)} {winner === 1 && '👑'}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span className={`font-mono text-sm font-medium`}
          style={{ color: winner === 2 ? 'var(--accent)' : 'var(--text-primary)' }}>
          {winner === 2 && '👑'} {formatNumber(v2)}
        </span>
      </div>
      <div className="flex gap-1 h-2">
        <div className="flex-1 rounded-l-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct1}%`, backgroundColor: 'var(--accent)', marginLeft: 'auto' }} />
        </div>
        <div className="flex-1 rounded-r-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct2}%`, backgroundColor: '#8b5cf6' }} />
        </div>
      </div>
    </div>
  )
}

export default function ComparePage() {
  const [u1, setU1] = useState('')
  const [u2, setU2] = useState('')
  const [s1, setS1] = useState('')
  const [s2, setS2] = useState('')

  const { data: user1, isLoading: l1 } = useGitHubUser(s1)
  const { data: user2, isLoading: l2 } = useGitHubUser(s2)
  const { data: repos1 = [] } = useGitHubRepos(s1)
  const { data: repos2 = [] } = useGitHubRepos(s2)

  const score1 = useMemo(() => user1 && repos1.length ? calculateDevScore(repos1, user1.followers) : null, [user1, repos1])
  const score2 = useMemo(() => user2 && repos2.length ? calculateDevScore(repos2, user2.followers) : null, [user2, repos2])

  const stars1 = repos1.reduce((a, r) => a + r.stargazers_count, 0)
  const stars2 = repos2.reduce((a, r) => a + r.stargazers_count, 0)
  const forks1 = repos1.reduce((a, r) => a + r.forks_count, 0)
  const forks2 = repos2.reduce((a, r) => a + r.forks_count, 0)

  const topLangs1 = getTopLanguages(repos1)
  const topLangs2 = getTopLanguages(repos2)

  const allLangs = [...new Set([...Object.keys(topLangs1), ...Object.keys(topLangs2)])].slice(0, 6)

  const radarData = allLangs.map(lang => ({
    lang,
    [s1 || 'User1']: topLangs1[lang] || 0,
    [s2 || 'User2']: topLangs2[lang] || 0,
  }))

  const bothLoaded = user1 && user2

  return (
    <div className="page-container space-y-8">
      <div>
        <h1 className="section-title">Developer Comparison</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Compare two GitHub profiles head-to-head
        </p>
      </div>

      {/* Search inputs */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <UserInput label="Developer 1" value={u1} onChange={setU1}
            onSearch={() => setS1(u1.trim())} loading={l1} />
          <div className="flex items-end justify-center pb-2">
            <span className="font-display font-bold text-xl" style={{ color: 'var(--text-muted)' }}>vs</span>
          </div>
          <UserInput label="Developer 2" value={u2} onChange={setU2}
            onSearch={() => setS2(u2.trim())} loading={l2} />
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          Try: <button onClick={() => { setU1('torvalds'); setS1('torvalds') }} className="hover:underline" style={{ color: 'var(--accent)' }}>torvalds</button> vs <button onClick={() => { setU2('gaearon'); setS2('gaearon') }} className="hover:underline" style={{ color: 'var(--accent)' }}>gaearon</button>
        </p>
      </div>

      {/* Comparison results */}
      {bothLoaded && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Avatar row */}
          <div className="card">
            <div className="flex items-center justify-between">
              <Avatar login={user1.login} name={user1.name} avatar={user1.avatar_url} />
              <div className="text-center">
                <div className="font-display font-black text-3xl" style={{ color: 'var(--text-muted)' }}>⚔️</div>
              </div>
              <Avatar login={user2.login} name={user2.name} avatar={user2.avatar_url} />
            </div>
          </div>

          {/* Stats comparison */}
          <div className="card">
            <h3 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
              Head-to-Head Stats
            </h3>
            <CompareRow label="Dev Score" v1={score1?.total ?? 0} v2={score2?.total ?? 0} />
            <CompareRow label="Followers" v1={user1.followers} v2={user2.followers} />
            <CompareRow label="Repositories" v1={user1.public_repos} v2={user2.public_repos} />
            <CompareRow label="Total Stars" v1={stars1} v2={stars2} />
            <CompareRow label="Total Forks" v1={forks1} v2={forks2} />
          </div>

          {/* Radar chart */}
          {radarData.length > 2 && (
            <div className="card">
              <h3 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                Language Overlap
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="lang" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Radar name={s1} dataKey={s1} stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} />
                  <Radar name={s2} dataKey={s2} stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)' }} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex gap-6 justify-center mt-2">
                <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--accent)' }} /> {s1}
                </span>
                <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-3 h-3 rounded-full bg-violet-500" /> {s2}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {!bothLoaded && (s1 || s2) && (
        <div className="card text-center py-10" style={{ color: 'var(--text-muted)' }}>
          {l1 || l2 ? 'Loading profiles...' : 'Load both developers to see comparison'}
        </div>
      )}
    </div>
  )
}
