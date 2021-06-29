import axios from 'axios'
import { Tool } from '../../domain/Tool'
import { ToolConfig, User } from '../../domain/User'

interface AddToolToUserRequest {
  auth0UserId: User['auth0UserId']
  toolConfig: ToolConfig['config']
  toolId: Tool['id']
}

export type AddToolToUserResponse = User

export async function addToolToUser(
  toolId: string,
  userId: string
): Promise<AddToolToUserResponse> {
  const request: AddToolToUserRequest = {
    auth0UserId: userId,
    toolConfig: {},
    toolId,
  }

  const { data } = await axios.post<AddToolToUserResponse>('/api/users/toolConfig', request)

  return data
}

export type DisableToolConfigResponse = User

export async function disableToolConfig(
  configId: string,
  userId: string
): Promise<DisableToolConfigResponse> {
  const { data } = await axios.post<DisableToolConfigResponse>(
    `/api/users/${userId}/toolConfig/${configId}/disable`
  )

  return data
}
