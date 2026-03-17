import type { GitHubRepo, DevScore, LanguageData, TechStack } from '../types'

export const calculateDevScore = (
  repos: GitHubRepo[],
  followers: number
): DevScore => {
  const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0)
  const totalForks = repos.reduce((acc, r) => acc + r.forks_count, 0)
  const totalRepos = repos.length
  const total = Math.round(
    totalStars * 2 + totalForks * 1.5 + totalRepos * 1 + followers * 2
  )

  let level = 'Beginner'
  if (total >= 100000) level = 'Legendary Developer'
  else if (total >= 50000) level = 'Open Source Pro'
  else if (total >= 10000) level = 'Rising Developer'
  else if (total >= 2000) level = 'Active Contributor'

  return {
    total,
    level,
    breakdown: {
      stars: totalStars * 2,
      forks: Math.round(totalForks * 1.5),
      repos: totalRepos,
      followers: followers * 2,
    },
  }
}

export const detectTechStack = (repos: GitHubRepo[]): TechStack => {
  const langCount: Record<string, number> = {}
  repos.forEach(r => {
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1
  })

  const allTopics = repos.flatMap(r => r.topics || [])
  const hasTopicOrLang = (keywords: string[]) =>
    keywords.some(k =>
      allTopics.some(t => t.toLowerCase().includes(k)) ||
      Object.keys(langCount).some(l => l.toLowerCase().includes(k))
    )

  const frontend: string[] = []
  const backend: string[] = []
  const tools: string[] = []

  if (hasTopicOrLang(['react'])) frontend.push('React')
  if (hasTopicOrLang(['vue'])) frontend.push('Vue')
  if (hasTopicOrLang(['angular'])) frontend.push('Angular')
  if (hasTopicOrLang(['svelte'])) frontend.push('Svelte')
  if (hasTopicOrLang(['next'])) frontend.push('Next.js')
  if (langCount['TypeScript']) frontend.push('TypeScript')
  if (langCount['CSS'] || langCount['HTML']) frontend.push('HTML/CSS')

  if (hasTopicOrLang(['node', 'express', 'fastify'])) backend.push('Node.js')
  if (langCount['Python']) backend.push('Python')
  if (langCount['Go']) backend.push('Go')
  if (langCount['Rust']) backend.push('Rust')
  if (langCount['Java']) backend.push('Java')
  if (langCount['C++']) backend.push('C++')
  if (hasTopicOrLang(['django', 'flask'])) backend.push('Django/Flask')

  if (hasTopicOrLang(['docker'])) tools.push('Docker')
  if (hasTopicOrLang(['kubernetes', 'k8s'])) tools.push('Kubernetes')
  if (hasTopicOrLang(['graphql'])) tools.push('GraphQL')
  if (hasTopicOrLang(['aws', 'gcp', 'azure'])) tools.push('Cloud')

  const languages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([l]) => l)

  return { frontend, backend, languages, tools }
}

export const getTopLanguages = (repos: GitHubRepo[]): Record<string, number> => {
  const langMap: Record<string, number> = {}
  repos.forEach(r => {
    if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1
  })
  return Object.fromEntries(
    Object.entries(langMap).sort((a, b) => b[1] - a[1]).slice(0, 8)
  )
}

export const aggregateLanguageBytes = (
  langData: LanguageData
): { name: string; value: number; percentage: number }[] => {
  const total = Object.values(langData).reduce((a, b) => a + b, 0)
  return Object.entries(langData)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / total) * 100),
    }))
}

export const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toString()
}

export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

// Build contribution heatmap from repo push dates
export const buildHeatmapData = (repos: GitHubRepo[]): Record<string, number> => {
  const map: Record<string, number> = {}
  repos.forEach(r => {
    const d = r.pushed_at?.slice(0, 10)
    if (d) map[d] = (map[d] || 0) + 1
  })
  return map
}

export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Scala: '#c22d40',
}

export const getLanguageColor = (lang: string): string =>
  LANGUAGE_COLORS[lang] ?? '#8b949e'
