export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  bio: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  fork: boolean
  created_at: string
  updated_at: string
  pushed_at: string
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
  topics: string[]
  visibility: string
  default_branch: string
  size: number
  license: { name: string } | null
}

export interface GitHubEvent {
  id: string
  type: string
  created_at: string
  repo: { name: string }
  payload: {
    commits?: { message: string }[]
    action?: string
    pull_request?: { title: string }
  }
}

export interface LanguageData {
  [language: string]: number
}

export interface DevScore {
  total: number
  level: string
  breakdown: {
    stars: number
    forks: number
    repos: number
    followers: number
  }
}

export interface TechStack {
  frontend: string[]
  backend: string[]
  languages: string[]
  tools: string[]
}

export interface CompareData {
  user1: GitHubUser
  user2: GitHubUser
  repos1: GitHubRepo[]
  repos2: GitHubRepo[]
}

export type SortOption = 'stars' | 'forks' | 'updated' | 'name'
export type ThemeMode = 'light' | 'dark'
