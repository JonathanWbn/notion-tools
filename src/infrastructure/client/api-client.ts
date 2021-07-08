/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useUser as use0AuthUser } from '@auth0/nextjs-auth0'
import { Database } from '@notionhq/client/build/src/api-types'
import axios from 'axios'
import useSWR from 'swr'
import { Tool } from '../../domain/Tool'
import { ToolConfig, User } from '../../domain/User'

interface AddToolToUserRequest {
  toolConfig: ToolConfig['config']
  toolId: Tool['id']
}

export type AddToolToUserResponse = User

export async function addToolToUser(toolId: string): Promise<void> {
  const request: AddToolToUserRequest = {
    toolConfig: {},
    toolId,
  }

  await axios.post<AddToolToUserResponse>('/api/users/tool-config', request)
}

export async function runToolConfig(configId: string): Promise<void> {
  await axios.post(`/api/users/tool-config/${configId}/run`)
}

export type UpdateToolConfigResponse = User

export async function updateToolConfig(
  configId: string,
  config: Partial<ToolConfig>
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

export function useTools() {
  const { data } = useSWR<Tool[]>('/api/tools', fetcher)

  return { tools: data }
}

export function useDatabases() {
  const { data: databases, mutate } = useSWR<Database[]>('/api/notion/databases', fetcher)

  return { databases, refetch: mutate }
}
