import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const TRENDING_DEVS = [
  { login: 'torvalds', name: 'Linus Torvalds', tag: 'Linux Kernel' },
  { login: 'gaearon', name: 'Dan Abramov', tag: 'React Core' },
  { login: 'sindresorhus', name: 'Sindre Sorhus', tag: 'Open Source' },
  { login: 'yyx990803', name: 'Evan You', tag: 'Vue.js' },
  { login: 'tj', name: 'TJ Holowaychuk', tag: 'Express / Koa' },
  { login: 'addyosmani', name: 'Addy Osmani', tag: 'Web Performance' },
]

export default function HomePage() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) navigate(`/profile/${username.trim()}`)
  }

  const handleQuick = (login: string) => navigate(`/profile/${login}`)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* background glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in srgb, var(--accent) 15%, transparent), transparent)',
          }} />

        <div className="page-container relative z-10 pt-16 pb-12 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <span className="stat-badge text-sm mb-4 inline-block">
              GitHub Analytics Platform
            </span>
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-tight mt-3"
              style={{ color: 'var(--text-primary)' }}>
              Decode any
              <br />
              <span style={{ color: 'var(--accent)' }}>developer's</span> story
            </h1>
            <p className="mt-5 text-lg max-w-xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}>
              Enter a GitHub username to get deep insights — repos, languages, stars, scores,
              and side-by-side comparisons.
            </p>
          </motion.div>

          {/* Search */}
          <motion.form onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10 flex gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: 'var(--text-muted)' }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter GitHub username..."
                className="input-field pl-12 py-4 text-base"
              />
            </div>
            <button type="submit" className="btn-primary px-8 text-base">
              Analyze
            </button>
          </motion.form>
        </div>
      </section>

      {/* Trending */}
      <section className="page-container">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}>
          <h2 className="section-title">Trending Developers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRENDING_DEVS.map((dev, i) => (
              <motion.button key={dev.login}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                onClick={() => handleQuick(dev.login)}
                className="card text-left hover:border-brand-400 transition-colors group">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://github.com/${dev.login}.png?size=64`}
                    alt={dev.login}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-sm truncate"
                      style={{ color: 'var(--text-primary)' }}>
                      {dev.name}
                    </p>
                    <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--accent)' }}>
                      @{dev.login}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {dev.tag}
                    </p>
                  </div>
                  <svg className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    style={{ color: 'var(--accent)' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '📊', title: 'Repository Analytics', desc: 'Charts for stars, forks, languages' },
            { icon: '🏆', title: 'Developer Score', desc: 'Custom formula-based ranking' },
            { icon: '⚔️', title: 'Developer Comparison', desc: 'Head-to-head profile battles' },
            { icon: '🔍', title: 'Repo Explorer', desc: 'Search & sort all repositories' },
          ].map(f => (
            <div key={f.title} className="card text-center py-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {f.title}
              </p>
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}
