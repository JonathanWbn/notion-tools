/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useUser as use0AuthUser } from '@auth0/nextjs-auth0'
import { Database } from '@notionhq/client/build/src/api-types'
import axios from 'axios'
import useSWR, { mutate } from 'swr'
import { IRecurringTask } from '../domain/RecurringTask'
import { User } from '../domain/User'

export type AddToolToUserResponse = IRecurringTask

export async function addToolToUser(): Promise<IRecurringTask> {
  const { data } = await axios.post<AddToolToUserResponse>('/api/users/tool-config')

  mutate('/api/users/me')

  return data
}

export async function deleteUser(): Promise<void> {
  await axios.delete('/api/users/me')
}

export async function runToolConfig(configId: string): Promise<void> {
  await axios.post(`/api/users/tool-config/${configId}/run`)
}

export type UpdateToolConfigResponse = User

export async function updateToolConfig(
  configId: string,
  config: Partial<IRecurringTask>
): Promise<UpdateToolConfigResponse> {
  const { data } = await axios.patch<UpdateToolConfigResponse>(
    `/api/users/tool-config/${configId}`,
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
