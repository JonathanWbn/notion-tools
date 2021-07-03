import { UserProfile, useUser as use0AuthUser } from '@auth0/nextjs-auth0'
import axios from 'axios'
import useSWR from 'swr'
import { Tool } from '../../domain/Tool'
import { ToolConfig, User } from '../../domain/User'

interface AddToolToUserRequest {
  toolConfig: ToolConfig['config']
  toolId: Tool['id']
}

export type AddToolToUserResponse = User

export async function addToolToUser(toolId: string): Promise<AddToolToUserResponse> {
  const request: AddToolToUserRequest = {
    toolConfig: {},
    toolId,
  }

  const { data } = await axios.post<AddToolToUserResponse>('/api/users/tool-config', request)

  return data
}

export type DisableToolConfigResponse = User

export async function disableToolConfig(configId: string): Promise<DisableToolConfigResponse> {
  const { data } = await axios.post<DisableToolConfigResponse>(
    `/api/users/tool-config/disable?configId=${configId}`
  )

  return data
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export function useUser(): { user?: User; auth0user?: UserProfile } {
  const { user: auth0user } = use0AuthUser()
  const { data: user } = useSWR<User>(auth0user?.sub ? '/api/users/me' : null, fetcher)

  return { user, auth0user }
}

export function useTools(): { tools: Tool[]; error: Error } {
  const { data, error } = useSWR('/api/tools', fetcher)

  return { tools: data, error }
}
