/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useUser as use0AuthUser } from '@auth0/nextjs-auth0'
import { Database, Page } from '@notionhq/client/build/src/api-types'
import axios from 'axios'
import useSWR, { mutate } from 'swr'
import { IDatabaseVisualization } from '../domain/DatabaseVisualization'
import { IRecurringTask } from '../domain/RecurringTask'
import { User } from '../domain/User'

export type AddRecurringTaskResponse = IRecurringTask

export async function addRecurringTask(): Promise<IRecurringTask> {
  const { data } = await axios.post<AddRecurringTaskResponse>('/api/users/recurring-task')

  mutate('/api/users/me')

  return data
}

export type AddDatabaseVisualizationResponse = IDatabaseVisualization

export async function addDatabaseVisualization(): Promise<IDatabaseVisualization> {
  const { data } = await axios.post<AddDatabaseVisualizationResponse>(
    '/api/users/database-visualization'
  )

  mutate('/api/users/me')

  return data
}

export async function deleteUser(): Promise<void> {
  await axios.delete('/api/users/me')
}

export async function runRecurringTask(configId: string): Promise<void> {
  await axios.post(`/api/users/recurring-task/${configId}/run`)
}

export type UpdateRecurringTaskResponse = User

export async function updateRecurringTask(
  configId: string,
  config: Partial<IRecurringTask>
): Promise<UpdateRecurringTaskResponse> {
  const { data } = await axios.patch<UpdateRecurringTaskResponse>(
    `/api/users/recurring-task/${configId}`,
    config
  )

  return data
}

export type UpdateDatabaseVisualizationResponse = User

export async function updateDatabaseVisualization(
  configId: string,
  config: Partial<IDatabaseVisualization>
): Promise<UpdateDatabaseVisualizationResponse> {
  const { data } = await axios.patch<UpdateDatabaseVisualizationResponse>(
    `/api/users/database-visualization/${configId}`,
    config
  )

  return data
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export function useUser() {
  const { user: auth0user } = use0AuthUser()
  const { data: user } = useSWR<User>(auth0user?.sub ? '/api/users/me' : null, fetcher)

  return { user, auth0user }
}

export function useDatabases() {
  const { data: databases, mutate } = useSWR<Database[]>('/api/notion/databases', fetcher)

  return { databases, refetch: mutate }
}

export function useDatabaseQuery(databaseId: string) {
  const { data: pages, mutate } = useSWR<Page[]>(`/api/notion/database/${databaseId}`, fetcher)

  return { pages, refetch: mutate }
}
