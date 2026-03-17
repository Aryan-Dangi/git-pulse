import { useQuery } from '@tanstack/react-query'
import { fetchUser, fetchRepos, fetchRepoLanguages, fetchRepo, fetchEvents } from '../services/githubApi'

export const useGitHubUser = (username: string) =>
  useQuery({
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  })

export const useGitHubRepos = (username: string) =>
  useQuery({
    queryKey: ['repos', username],
    queryFn: () => fetchRepos(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  })

export const useRepoLanguages = (owner: string, repo: string) =>
  useQuery({
    queryKey: ['languages', owner, repo],
    queryFn: () => fetchRepoLanguages(owner, repo),
    enabled: !!owner && !!repo,
    staleTime: 1000 * 60 * 10,
  })

export const useRepo = (owner: string, repo: string) =>
  useQuery({
    queryKey: ['repo', owner, repo],
    queryFn: () => fetchRepo(owner, repo),
    enabled: !!owner && !!repo,
  })

export const useGitHubEvents = (username: string) =>
  useQuery({
    queryKey: ['events', username],
    queryFn: () => fetchEvents(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  })
