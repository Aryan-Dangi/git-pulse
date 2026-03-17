import axios from 'axios'
import type { GitHubUser, GitHubRepo, LanguageData, GitHubEvent } from '../types'

const BASE_URL = 'https://api.github.com'

const githubApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
})

export const fetchUser = async (username: string): Promise<GitHubUser> => {
  const { data } = await githubApi.get<GitHubUser>(`/users/${username}`)
  return data
}

export const fetchRepos = async (username: string): Promise<GitHubRepo[]> => {
  const allRepos: GitHubRepo[] = []
  let page = 1
  const perPage = 100
  while (true) {
    const { data } = await githubApi.get<GitHubRepo[]>(
      `/users/${username}/repos`,
      { params: { per_page: perPage, page, sort: 'updated' } }
    )
    allRepos.push(...data)
    if (data.length < perPage) break
    page++
    if (page > 5) break
  }
  return allRepos
}

export const fetchRepoLanguages = async (
  owner: string,
  repo: string
): Promise<LanguageData> => {
  const { data } = await githubApi.get<LanguageData>(
    `/repos/${owner}/${repo}/languages`
  )
  return data
}

export const fetchRepo = async (
  owner: string,
  repo: string
): Promise<GitHubRepo> => {
  const { data } = await githubApi.get<GitHubRepo>(`/repos/${owner}/${repo}`)
  return data
}

export const fetchEvents = async (username: string): Promise<GitHubEvent[]> => {
  const { data } = await githubApi.get<GitHubEvent[]>(
    `/users/${username}/events/public`,
    { params: { per_page: 100 } }
  )
  return data
}

export default githubApi
