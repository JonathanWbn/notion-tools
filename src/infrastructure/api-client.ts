import { DatabaseVisualization } from '../domain/DatabaseVisualization'
import { RecurringTask } from '../domain/RecurringTask'
import { User } from '../domain/User'
import { useUser as use0AuthUser } from '@auth0/nextjs-auth0/client'
import { Database } from '@notionhq/client/build/src/api-types'
import axios from 'axios'
import useSWR from 'swr'

export async function runRecurringTask(configId: string): Promise<void> {
  await axios.post(`/api/users/recurring-task/${configId}/run`)
}

export type UpdateRecurringTaskResponse = User

export async function updateRecurringTask(
  configId: string,
  config: Partial<RecurringTask>
): Promise<UpdateRecurringTaskResponse> {
  const { data } = await axios.patch<UpdateRecurringTaskResponse>(
    `/api/users/recurring-task/${configId}`,
    config
  )

  return data
}

export async function deleteRecurringTask(configId: string): Promise<void> {
  await axios.delete<UpdateRecurringTaskResponse>(`/api/users/recurring-task/${configId}`)
}

export type UpdateDatabaseVisualizationResponse = User

export async function updateDatabaseVisualization(
  configId: string,
  config: Partial<DatabaseVisualization>
): Promise<UpdateDatabaseVisualizationResponse> {
  const { data } = await axios.patch<UpdateDatabaseVisualizationResponse>(
    `/api/users/database-visualization/${configId}`,
    config
  )

  return data
}

const fetcher = (url: string) =>
  axios.get(url, { headers: { url: window.location.href } }).then((res) => res.data)

export function useDatabases() {
  const { data: databases, mutate } = useSWR<Database[]>('/api/notion/databases', fetcher)

  return { databases, refetch: mutate }
}
